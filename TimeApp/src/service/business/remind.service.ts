import { Injectable } from "@angular/core";
import { BaseService, SortType } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EmitService } from "../util-service/emit.service";
import { UserConfig } from "../config/user.config";
import { PlanItemData, generateDataType } from "./calendar.service";
import { EventService, AgendaData, TaskData, MiniTaskData, EventData, TxJson, generateTxJson } from "./event.service";
import { MemoData, MemoService } from "./memo.service";
import {SyncType, DelType, EventType, ObjectType, IsSuccess, SyncDataStatus, OperateType, ToDoListStatus, RepeatFlag, ConfirmType, ModiPower, PageDirection, SyncDataSecurity, InviteState, CompleteState, EventFinishStatus} from "../../data.enum";
import {SyncRestful} from "../restful/syncsev";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import * as moment from "moment";

@Injectable()
export class ScheduleRemindService extends BaseService {

  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService,
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
  async syncScheduledReminds(datas: Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData> = new Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData>(), limit: number = 48) {
    this.assertEmpty(datas);  // 入参不能为空
    this.assertEmpty(limit);  // 限制小时数不能为空

    let limitms: number = limit * 60 * 60 * 1000;
    let schedulereminds: Array<any> = new Array<any>();

    // 指定数据提醒上传服务器
    for (let data of datas) {
      let activityType: string = this.getActivityType(data);
      let txjson: TxJson;

      switch (activityType) {
        case "PlanItemData" :
          let planitem: PlanItemData = {} as PlanItemData;
          Object.assign(planitem, data);

          txjson = generateTxJson(planitem.txjson, planitem.tx);
          let sd: string = planitem.sd;
          let st: string = planitem.st;

          txjson.each(sd, st, (datetime) => {
            let remindgap: number = moment().diff(datetime);

            // 将来提醒，且在将来48小时以内
            if (remindgap <= 0 && (limitms + remindgap) >= 0) {
              schedulereminds.push({
                remindid: planitem.jti + moment(datetime).format("YYYYMMDDHHmm"),
                wd: moment(datetime).format("YYYY/MM/DD"),
                wt: moment(datetime).format("HH:mm"),
                active: (planitem.del != DelType.del),
                data: {
                  datatype: generateDataType(activityType),
                  datas: [{
                    accountid: UserConfig.account.id,
                    phoneno: UserConfig.account.phone,
                    id: planitem.jti,
                    continue: false,
                    wd: moment(datetime).format("YYYY/MM/DD"),
                    wt: moment(datetime).format("HH:mm"),
                  }]
                }
              });
            }
          });

          break;
        case "AgendaData" :
        case "TaskData" :
        case "MiniTaskData" :
          let event: EventData = {} as EventData;
          Object.assign(event, data);

          txjson = generateTxJson(event.txjson, event.tx);
          let evd: string = event.evd;
          let evt: string = event.evt;

          // 针对加入重要事项,且没有完成的日程,增加默认提醒
          if (event.todolist == ToDoListStatus.On && event.wc != EventFinishStatus.Finished) {
            let remindgap: number = moment().diff(evd + " " + evt);

            // 预定完成时间比现在小，需要设置未来48小时内，不小于当前+1小时的默认提醒
            if (remindgap > 0) {
              while (remindgap > 0) {
                // 往后推迟4小时
                let after4hours = moment(evd + " " + evt, "YYYY/MM/DD HH:mm").add(4, "hours");

                evd = after4hours.format("YYYY/MM/DD");
                evt = after4hours.format("HH:mm");

                // 判断不小于当前+1小时
                let plus1hours = moment().add(1, "hours");

                if (plus1hours.diff(evd + " " + evt) <= 0) {
                  remindgap = moment().diff(evd + " " + evt);
                }
              }
            }

            // 将来提醒，且在将来48小时以内
            if (remindgap <= 0 && (limitms + remindgap) >= 0) {
              schedulereminds.push({
                remindid: event.evi,
                wd: evd,
                wt: evt,
                active: (event.del != DelType.del),
                data: {
                  datatype: generateDataType(activityType),
                  datas: [{
                    accountid: UserConfig.account.id,
                    phoneno: UserConfig.account.phone,
                    id: event.evi,
                    continue: true,
                    wd: evd,
                    wt: evt,
                  }]
                }
              });
            }
          }

          txjson.each(evd, evt, (datetime) => {
            let remindgap: number = moment().diff(datetime);

            // 将来提醒，且在将来48小时以内
            if (remindgap <= 0 && (limitms + remindgap) >= 0) {
              schedulereminds.push({
                remindid: event.evi + moment(datetime).format("YYYYMMDDHHmm"),
                wd: moment(datetime).format("YYYY/MM/DD"),
                wt: moment(datetime).format("HH:mm"),
                active: (event.del != DelType.del),
                data: {
                  datatype: generateDataType(activityType),
                  datas: [{
                    accountid: UserConfig.account.id,
                    phoneno: UserConfig.account.phone,
                    id: event.evi,
                    continue: false,
                    wd: moment(datetime).format("YYYY/MM/DD"),
                    wt: moment(datetime).format("HH:mm"),
                  }]
                }
              });
            }
          });

          break;
        default:
          continue;   // 提醒只有在日历项、日程、任务和小任务中存在
      }
    }

    // 没有指定数据则查询48小时内所有未同步提醒
    if (datas.length <= 0) {
      let start = moment().subtract(10, "minutes");
      let end = moment().add(limit, "hours");

      // 把未来48小时以前所有未同步的提醒都同步到服务器上
      // 包括当前时间以前已删除的提醒
      let sql: string = `select case ev.type when '0' then 'AgendaData' when '1' then 'TaskData' else 'MiniTaskData' end type, wa.*
                    from (select * from gtd_wa
                    where (tb <> ?1
                        and obt = ?6
                        and datetime(replace(wd, '/', '-'), wt) >= datetime(replace(?2, '/', '-'), ?3)
                        and datetime(replace(wd, '/', '-'), wt) <= datetime(replace(?4, '/', '-'), ?5))
                      or (tb <> ?1
                        and obt = ?6
                        and del = ?8
                        and datetime(replace(wd, '/', '-'), wt) < datetime(replace(?2, '/', '-'), ?3))
                      ) wa
                    left join gtd_ev ev
                    on ev.evi = wa.obi
                  union all
                    select 'PlanItemData' type, wa.*
                    from (select * from gtd_wa
                    where (tb <> ?1
                        and obt = ?7
                        and datetime(replace(wd, '/', '-'), wt) >= datetime(replace(?2, '/', '-'), ?3)
                        and datetime(replace(wd, '/', '-'), wt) <= datetime(replace(?4, '/', '-'), ?5))
                      or (tb <> ?1
                        and obt = ?7
                        and del = ?8
                        and datetime(replace(wd, '/', '-'), wt) < datetime(replace(?2, '/', '-'), ?3))
                      ) wa
                    left join gtd_jta jta
                    on jta.jti = wa.obi`;

      let reminds: Array<RemindData> = await this.sqlExce.getExtLstByParam<RemindData>(sql, [
                                  SyncType.synch,
                                  start.format("YYYY/MM/DD"),
                                  start.format("HH:mm"),
                                  end.format("YYYY/MM/DD"),
                                  end.format("HH:mm"),
                                  ObjectType.Event,
                                  ObjectType.Calendar,
                                  DelType.del
                                ]) || new Array<RemindData>();

      for (let remind of reminds) {
        schedulereminds.push({
          remindid: remind.wai,
          wd: remind.wd,
          wt: remind.wt,
          active: (remind.del != DelType.del),
          data: {
            datatype: generateDataType(remind.type),
            datas: [{
              accountid: UserConfig.account.id,
              phoneno: UserConfig.account.phone,
              id: remind.obi,
              continue: (remind.wai == remind.obi),
              wd: remind.wd,
              wt: remind.wt
            }]
          }
        });
      }
    }

    // 提交服务器
    for (let schedule of schedulereminds) {
      let result = await this.syncRestful.putScheduledRemind(
        UserConfig.account.id,
        schedule.remindid,
        schedule.wd,
        schedule.wt,
        schedule.data,
        schedule.active
      );

      console.log(result);
    }

  }

  /**
   * 取得活动类型
   *
   * @author leon_xi@163.com
   **/
  getActivityType(source: PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData): string {

    this.assertEmpty(source);

    let src: any = source;

    if (src.jti) {  // PlanItemData
      return "PlanItemData";
    }

    if (src.evi && src.type == EventType.Agenda) {    // AgendaData
      return "AgendaData";
    }

    if (src.evi && src.type == EventType.Task) {    // TaskData
      return "TaskData";
    }

    if (src.evi && src.type == EventType.MiniTask) {    // MiniTaskData
      return "MiniTaskData";
    }

    if (src.moi) {    // MemoData
      return "MemoData";
    }

    this.assertFail();
  }
}

export interface RemindData extends WaTbl {
  type: string;
}
