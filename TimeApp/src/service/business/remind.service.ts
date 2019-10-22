import { Injectable } from "@angular/core";
import { BaseService, SortType } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EmitService } from "../util-service/emit.service";
import { UserConfig } from "../config/user.config";
import { CalendarService, PlanItemData, generateDataType } from "./calendar.service";
import { EventService, AgendaData, TaskData, MiniTaskData, TxJson, generateTxJson } from "./event.service";
import {SyncType, DelType, ObjectType, IsSuccess, SyncDataStatus, OperateType, ToDoListStatus, RepeatFlag, ConfirmType, ModiPower, PageDirection, SyncDataSecurity, InviteState, CompleteState, EventFinishStatus} from "../../data.enum";
import {SyncRestful} from "../restful/syncsev";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import * as moment from "moment";

@Injectable()
export class RemindService extends BaseService {

  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private syncRestful: SyncRestful,
              private userConfig: UserConfig) {
    super();
  }

  /**
   * 同步指定数据或所有数据的计划提醒到服务器
   * 只同步未来48小时内的计划提醒
   *
   * @author leon_xi@163.com
   */
  async syncScheduledReminds(datas: Array<PlanItemData | AgendaData | TaskData | MiniTaskData> = new Array<PlanItemData | AgendaData | TaskData | MiniTaskData>(), limit: number = 48) {
    this.assertEmpty(datas);  // 入参不能为空
    this.assertEmpty(limit);  // 限制小时数不能为空

    let limitminutes: number = limit * 60;
    let schedulereminds: Array<any> = new Array<any>();

    // 指定数据提醒上传服务器
    for (let data of datas) {
      let activityType: string = this.calendarService.getActivityType(data);

      switch (activityType) {
        case "PlanItemData" :
          let txjson: TxJson = generateTxJson(data.txjson, data.tx);
          let sd: string = data.sd;
          let st: string = data.st;

          txjson.each(sd, st, (datetime) => {
            let remindgap: number = moment().diff(datetime);

            // 将来提醒，且在将来48小时以内
            if (remindgap <= 0 && (limitminutes + remindgap) >= 0) {
              schedulereminds.push({
                remindid: data.jti + moment(datetime).format("YYYYMMDDHHmm"),
                wd: moment(datetime).format("YYYY/MM/DD"),
                wt: moment(datetime).format("HH:mm"),
                active: true,
                data: {
                  datatype: generateDataType(activityType),
                  datas: [{
                    phoneno: UserConfig.account.phone,
                    id: data.jti
                  }]
                }
              });
            }
          });

          break;
        case "AgendaData" :
        case "TaskData" :
        case "MiniTaskData" :
          let txjson: TxJson = generateTxJson(data.txjson, data.tx);
          let evd: string = data.evd;
          let evt: string = data.evt;

          txjson.each(evd, evt, (datetime) => {
            let remindgap: number = moment().diff(datetime);

            // 将来提醒，且在将来48小时以内
            if (remindgap <= 0 && (limitminutes + remindgap) >= 0) {
              schedulereminds.push({
                remindid: data.evi + moment(datetime).format("YYYYMMDDHHmm"),
                wd: moment(datetime).format("YYYY/MM/DD"),
                wt: moment(datetime).format("HH:mm"),
                active: true,
                data: {
                  datatype: generateDataType(activityType),
                  datas: [{
                    phoneno: UserConfig.account.phone,
                    id: data.evi
                  }]
                }
              });
            }
          });

          break;
        default:
          this.assertFail("提醒只有在日历项、日程、任务和小任务中存在");
      }
    }

    // 没有指定数据则查询48小时内所有未同步提醒
    if (datas.length <= 0) {
      let start = moment();
      let end = moment().add(limit, "hours");

      let sql: string = `select case ev.type when '0' then 'AgendaData' when '1' then 'TaskData' else 'MiniTaskData' end type, wa.*
                    from (select * from gtd_wa
                    where tb <> ?1
                      and obt = ?6
                      and datetime(replace(wd, '/', '-'), wt) >= datetime(replace(?2, '/', '-'), ?3)
                      and datetime(replace(wd, '/', '-'), wt) <= datetime(replace(?4, '/', '-'), ?5)) wa
                    left join gtd_ev ev
                    on ev.evi = wa.obi
                  union all
                    select 'PlanItemData' type, wa.*
                    from (select * from gtd_wa
                    where tb <> ?1
                      and obt = ?7
                      and datetime(replace(wd, '/', '-'), wt) >= datetime(replace(?2, '/', '-'), ?3)
                      and datetime(replace(wd, '/', '-'), wt) <= datetime(replace(?4, '/', '-'), ?5)) wa
                    left join gtd_jta jta
                    on jta.jti = wa.obi`;

      let reminds: Array<RemindData> = this.sqlExce.getExtLstByParam(sql, [
                                  SyncType.synch,
                                  start.format("YYYY/MM/DD"),
                                  start.format("HH:mm"),
                                  end.format("YYYY/MM/DD"),
                                  end.format("HH:mm"),
                                  ObjectType.Event,
                                  ObjectType.Calendar
                                ]) || new Array<WaTbl>;

      for (let remind of reminds) {
        schedulereminds.push({
          remindid: remind.wai,
          wd: remind.wd,
          wt: remind.wt,
          active: (remind.del <> DelType.del),
          data: {
            datatype: generateDataType(remind.type),
            datas: [{
              phoneno: UserConfig.account.phone,
              id: remind.obi
            }]
          }
        });
      }
    }

    // 提交服务器
    for (let schedule of schedulereminds) {
      await this.syncRestful.putScheduledRemind(
        UserConfig.account.id,
        schedule.remindid,
        schedule.wd,
        schedule.wt,
        schedule.data,
        schedule.active
      );
    }

  }
}

export interface RemindData extends WaTbl {
  type: string;
}
