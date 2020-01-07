import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { UserConfig } from "../config/user.config";
import { PlanItemData, generateDataType } from "./calendar.service";
import { AgendaData, TaskData, MiniTaskData, EventData, TxJson, generateTxJson } from "./event.service";
import { MemoData } from "./memo.service";
import {SyncType, DelType, EventType, ObjectType, ToDoListStatus, EventFinishStatus} from "../../data.enum";
import {SyncRestful} from "../restful/syncsev";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import * as moment from "moment";
import {T} from "../../ws/model/ws.enum";

@Injectable()
export class ScheduleRemindService extends BaseService {

  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private syncRestful: SyncRestful) {
    super();
    moment.locale('zh-cn');
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
    let eviArray = new Array<string>();
    let jtiArray = new Array<string>();
    // 指定数据提醒上传服务器
    for (let data of datas) {

      let activityType: string = this.getActivityType(data);
      let txjson: TxJson;

      switch (activityType) {
        case "PlanItemData" :
          let planitem: PlanItemData = {} as PlanItemData;
          Object.assign(planitem, data);

          jtiArray.push("'"+planitem.jti+"'");

          txjson = generateTxJson(planitem.txjson, planitem.tx);
          let sd: string = planitem.sd;
          let st: string = planitem.st;

          txjson.each(sd, st, (datetime) => {
            let remindgap: number = moment().diff(datetime);

            // 将来提醒，且在将来48小时以内
            if (remindgap <= 0 && (limitms + remindgap) >= 0) {
              schedulereminds.push({
                remindid: planitem.jti + datetime.format("YYYYMMDDHHmm"),
                wd: datetime.format("YYYY/MM/DD"),
                wt: datetime.format("HH:mm"),
                active: (!txjson.close && planitem.del != DelType.del),
                data: {
                  datatype: generateDataType(activityType),
                  datas: [{
                    accountid: UserConfig.account.id,
                    phoneno: UserConfig.account.phone,
                    id: planitem.jti,
                    continue: false,
                    wd: datetime.format("YYYY/MM/DD"),
                    wt: datetime.format("HH:mm"),
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
          eviArray.push("'"+event.evi+"'");
          txjson = generateTxJson(event.txjson, event.tx);
          let evd: string = event.evd;
          let evt: string = event.evt;

          // 针对加入重要事项,且没有完成的日程,增加默认提醒
          if (event.todolist == ToDoListStatus.On && event.wc != EventFinishStatus.Finished) {
            let remindgap: number = moment().diff(moment(evd + " " + evt, "YYYY/MM/DD HH:mm", true));

            // 预定完成时间比现在小，需要设置未来48小时内，不小于当前+1小时的默认提醒
            if (remindgap > 0) {
              while (remindgap > 0) {
                // 往后推迟4小时
                let after4hours = moment(evd + " " + evt, "YYYY/MM/DD HH:mm", true).add(4, "hours");

                evd = after4hours.format("YYYY/MM/DD");
                evt = after4hours.format("HH:mm");

                // 判断不小于当前+1小时
                let plus1hours = moment().add(1, "hours");

                if (plus1hours.diff(moment(evd + " " + evt, "YYYY/MM/DD HH:mm", true)) <= 0) {
                  remindgap = moment().diff(moment(evd + " " + evt, "YYYY/MM/DD HH:mm", true));
                }
              }
            }

            // 将来提醒，且在将来48小时以内
            if (remindgap <= 0 && (limitms + remindgap) >= 0) {
              schedulereminds.push({
                remindid: event.evi,
                wd: evd,
                wt: evt,
                active: (!txjson.close && event.del != DelType.del),
                data: {
                  datatype: generateDataType(activityType),
                  datas: [{
                    accountid: UserConfig.account.id,
                    phoneno: UserConfig.account.phone,
                    id: event.evi,
                    continue: true,
                    wd: evd,
                    wt: evt,
                    groupid:event.rtevi || event.evi
                  }]
                }
              });
            }
          }

          txjson.each(event.evd, event.evt, (datetime) => {
            let remindgap: number = moment().diff(datetime);

            // 将来提醒，且在将来48小时以内
            if (remindgap <= 0 && (limitms + remindgap) >= 0) {
              console.log("单个日程提醒将来48小时内提交fwq=============：evd ="+event.evd +";evt="+event.evt +";datetime= " + datetime.format("YYYY/MM/DD HH:mm") +";remindgap="+remindgap);
              schedulereminds.push({
                remindid: event.evi + datetime.format("YYYYMMDDHHmm"),
                wd: datetime.format("YYYY/MM/DD"),
                wt: datetime.format("HH:mm"),
                active: (!txjson.close && event.del != DelType.del),
                data: {
                  datatype: generateDataType(activityType),
                  datas: [{
                    accountid: UserConfig.account.id,
                    phoneno: UserConfig.account.phone,
                    id: event.evi,
                    continue: false,
                    wd: datetime.format("YYYY/MM/DD"),
                    wt: datetime.format("HH:mm"),
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

    //提交删除过期提醒
    if (eviArray.length > 0 || jtiArray.length > 0) {
      let evistring = eviArray.join(",");
      let jtistring = eviArray.join(",");
      let obistring = [...eviArray,...jtiArray].join(",");
      let ppsql = "select '-1' type ,'-1' pki ";
      if (eviArray.length > 0 ){
        ppsql = ppsql  + ` union all select case type when '0' then 'AgendaData' when '1' then 'TaskData' else 'MiniTaskData' end type ,
                evi pki from gtd_ev where evi in (${evistring}) `;
      }
      if (jtiArray.length > 0){
        ppsql = ppsql + ` union all select 'PlanItemData' type,jti pki from gtd_jta where jti in (${jtistring}) `;
      }

      ppsql = ` select evpl.*,wa.* from
              (select * from gtd_wa where tb = 'unsynch' and obi in (${obistring})
              and (wd|| ' ' ||wt < '${moment().format("YYYY/MM/DD HH:mm")}' or del ='del' )
            ) wa inner join (${ppsql}) evpl
            on wa.obi = evpl.pki  ; `;
      let ppReminds: Array<RemindData> = await this.sqlExce.getExtLstByParam<RemindData>(ppsql, []);
      for (let remind of ppReminds) {

        console.log("单个日程提醒过期提醒提交fwq=============：evi="+remind.obi +";datetime= " + remind.wd +":"+remind.wt);
        schedulereminds.push({
          remindid: remind.wai,
          wd: remind.wd,
          wt: remind.wt,
          active: false,
          data: {
            datatype: generateDataType(remind.type),
            datas: [{
              accountid: UserConfig.account.id,
              phoneno: UserConfig.account.phone,
              id: remind.obi,
              continue: false,
              wd: remind.wd,
              wt: remind.wt
            }]
          }
        });
      }
      // 更新同步状态
      let updateppsql: string = `update gtd_wa set tb = 'synch' where obi in ( ${obistring} )
       and tb = 'unsynch'
          and (wd|| ' ' ||wt < '${moment().format("YYYY/MM/DD HH:mm")}' or del ='del' ) ;`;

      await this.sqlExce.execSql(updateppsql, []);

    }

    // 没有指定数据则查询48小时内所有未同步提醒
    if (datas.length <= 0) {
      let start = moment().subtract(10, "minutes");
      let end = moment().add(limit, "hours");

      // 把未来48小时以前所有未同步的提醒都同步到服务器上
      // 包括当前时间以前已删除的提醒
      let sql: string = `select case ev.type when '0' then 'AgendaData' when '1' then 'TaskData' else 'MiniTaskData' end type,
                    ev.evi pki,ev.rtevi rtpki,ev.tx tx, wa.*
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
                    select 'PlanItemData' type,
                    jta.jti pki ,'' rtpki,jta.tx tx, wa.*
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

      if (reminds && reminds.length > 0) {
        this.util.toastStart(`发现${reminds.length}条未同步提醒, 开始同步...`, 1000);
      }

      for (let remind of reminds) {
        let txjson = new TxJson();

        if (remind.tx){
          Object.assign(txjson, JSON.parse(remind.tx));
        }

        schedulereminds.push({
          remindid: remind.wai,
          wd: remind.wd,
          wt: remind.wt,
          active: (!txjson.close && remind.del != DelType.del),
          data: {
            datatype: generateDataType(remind.type),
            datas: [{
              accountid: UserConfig.account.id,
              phoneno: UserConfig.account.phone,
              id: remind.obi,
              continue: (remind.wai == remind.obi),
              wd: remind.wd,
              wt: remind.wt,
              groupid:remind.wai == remind.obi? (remind.rtpki || remind.pki) : ""
            }]
          }
        });
      }
    }

    let syncRemindIds: Array<string> = new Array<string>();

    // 提交服务器
    if (schedulereminds.length > 1) {
      let remindparams: Array<any> = new Array<any>();

      for (let schedule of schedulereminds) {

        if (remindparams.length <= 10) {
          remindparams.push({
            id: schedule.remindid,
            wd: schedule.wd,
            wt: schedule.wt,
            data: schedule.data,
            active: schedule.active
          });
        } else {
          try {
            console.log("批量提交fwq schedulereminds======+"+JSON.stringify(schedule));
            await this.syncRestful.putScheduledMultiReminds(
              UserConfig.account.id,
              remindparams
            );

            remindparams.forEach((value) => {
              syncRemindIds.push(value.id);
            });
          } catch (err) {
            console.log("Push schedule error.")
          }

          remindparams = new Array<any>();
        }
      }

      if (remindparams.length > 0) {
        try {
          console.log("批量提交fwq schedulereminds======+"+JSON.stringify(schedule));
          await this.syncRestful.putScheduledMultiReminds(
            UserConfig.account.id,
            remindparams
          );

          remindparams.forEach((value) => {
            syncRemindIds.push(value.id);
          });
        } catch (err) {
          console.log("Push schedule error.")
        }

        remindparams = new Array<any>();
      }
    } else {
      for (let schedule of schedulereminds) {
        try {
          console.log("批量提交fwq schedulereminds======+"+JSON.stringify(schedule));
          await this.syncRestful.putScheduledRemind(
            UserConfig.account.id,
            schedule.remindid,
            schedule.wd,
            schedule.wt,
            schedule.data,
            schedule.active
          );

          syncRemindIds.push(schedule.remindid);
        } catch (err) {
          console.log("Push schedule error.")
        }
      }
    }

    // 更新同步状态
    if (syncRemindIds.length > 0) {
      let updatesql: string = `update gtd_wa set tb = ?1 where wai in ('` + syncRemindIds.join(`', '`) + `')`;

      await this.sqlExce.execSql(updatesql, [SyncType.synch]);
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
  tx:string,
  pki:string,
  rtpki:string,
  type: string;
}
