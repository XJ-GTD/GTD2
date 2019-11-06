import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EvTbl } from "../sqlite/tbl/ev.tbl";
import { TTbl } from "../sqlite/tbl/t.tbl";
import { CaTbl } from "../sqlite/tbl/ca.tbl";
import {UserConfig} from "../config/user.config";
import {AgdRestful} from "../restful/agdsev";
import * as moment from "moment";
import {ETbl} from "../sqlite/tbl/e.tbl";
import {EmitService} from "../util-service/emit.service";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import * as anyenum from "../../data.enum";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import {ParTbl} from "../sqlite/tbl/par.tbl";
import {JhaTbl} from "../sqlite/tbl/jha.tbl";
import {DataConfig} from "../config/data.config";
import {BTbl} from "../sqlite/tbl/b.tbl";
import {FjTbl} from "../sqlite/tbl/fj.tbl";
import {DataRestful, PullInData, PushInData, SyncData, SyncDataFields, UploadInData, DownloadInData} from "../restful/datasev";
import {SyncType, DelType, ObjectType, IsSuccess, CycleType, SyncDataStatus, OperateType, ToDoListStatus, RepeatFlag, ConfirmType, ModiPower, PageDirection, SyncDataSecurity, InviteState, CompleteState, EventFinishStatus} from "../../data.enum";
import {
  assertNotNumber,
  assertEmpty,
  assertFail
} from "../../util/util";
import {FsData} from "../../data.mapping";
import {File} from '@ionic-native/file';

@Injectable()
export class EventService extends BaseService {
  constructor(private sqlExce: SqliteExec, private util: UtilService,
              private agdRest: AgdRestful,private emitService:EmitService,
              private file: File,
              private bacRestful: BacRestful,private userConfig: UserConfig,
              private dataRestful: DataRestful) {
    super();
  }

  EVT_ST = "08:00";//全天开始时间默认为8:00

  /**
   * 接收事件日程保存到本地
   *
   * @param {Array<AgendaData>} pullAgdatas
   * @param {SyncDataStatus} status
   * @returns {Promise<Array<AgendaData>>}
   */
  async receivedAgendaData(pullAgdatas: Array<AgendaData>, status: SyncDataStatus): Promise<Array<AgendaData>> {

    this.assertEmpty(pullAgdatas);     // 入参不能为空
    this.assertEmpty(status);   // 入参不能为空

    let sqlparam = new Array<any>();

    let saved: Array<AgendaData> = new Array<AgendaData>();
    let nwfj = new Array<FjTbl>();
    let was = new Array<WaTbl>();

    if (pullAgdatas && pullAgdatas !=null ){

      for (let j = 0 , len = pullAgdatas.length; j < len ; j++){
        let agd = {} as AgendaData;
        Object.assign(agd, pullAgdatas[j]);

        // 删除参与人时，通过这个字段传递删除数据
        if (status == SyncDataStatus.Deleted) {
          agd.del = DelType.del;
        } else {
          // 删除字段不共享, 如果不存在需要设置默认值
          if (!agd.del) agd.del = DelType.undel;
        }

        agd.tb = SyncType.synch;

        // 非共享字段，第一次接收需要付初值
        if (!agd.todolist) {
          agd.todolist = ToDoListStatus.Off;
        }

        if (!agd.wc) {
          agd.wc = EventFinishStatus.NonFinish;
        }

        if (!agd.bz) {
          agd.bz = "";
        }

        if (!agd.ji) {
          agd.ji = "";
        }

        if (!agd.tx) {
          agd.txjson = generateTxJson(agd.txjson, agd.tx);
          agd.txs = agd.txjson.text();
        }else{
          agd.txjson = generateTxJson(agd.txjson, agd.tx);
        }

        if (!agd.invitestatus) {
          agd.invitestatus = InviteState.None;
        }

        let ev = new EvTbl();
        Object.assign(ev,agd);
        sqlparam.push(ev.rpTParam());

        if ( agd.rfg == anyenum.RepeatFlag.RepeatToOnly){
          //相关日程更新
          let ca = new CaTbl();
          Object.assign(ca,agd);
          sqlparam.push(ca.rpTParam());

        }

        if (agd.rtevi == "" ){
          //相关日程更新
          let ca = new CaTbl();
          Object.assign(ca,agd);
          sqlparam.push(ca.rpTParam());


          //删除参与人
          let par = new ParTbl();
          par.obt = anyenum.ObjectType.Event;
          par.obi = agd.evi;
          sqlparam.push(par.dTParam());
          //参与人更新
          let nwpar = new Array<any>();
          if (agd.del != anyenum.DelType.del){
            nwpar = this.sqlparamAddPar(agd.evi , agd.members) ;

            sqlparam = [...sqlparam,...nwpar];
          }


        }

        // 删除相关提醒
        let sq : string;
        let params : Array<any>;
        sq = `update gtd_wa set tb = ? ,del = ?  where  obi = ? and obt = ?; `;
        params = new Array<any>();
        params.push(anyenum.SyncType.unsynch);
        params.push(anyenum.DelType.del);
        params.push(agd.evi);
        params.push(anyenum.ObjectType.Event);
        sqlparam.push([sq,params]);

        if (agd.del != DelType.del){
          if (ev.todolist == anyenum.ToDoListStatus.On ) {
            //如果在todolist中，则加系统提醒
            was.push(this.sqlparamAddSysTx2(ev,anyenum.ObjectType.Event));
          }else{
            let wa = new WaTbl();
            wa.wai = ev.evi;
            wa.tb = anyenum.SyncType.unsynch;
            wa.del = anyenum.DelType.del;
            sqlparam.push(wa.upTParam());
          }
          //提醒新建
          if (agd.txjson.reminds && agd.txjson.reminds.length > 0) {
            was = [...was,...this.sqlparamAddTxWa2(ev, anyenum.ObjectType.Event,  agd.txjson)];
          }
        }


        /*//相关附件更新
        if (agd.attachments && agd.attachments != null && agd.attachments.length > 0) {
          //删除附件
          let fj = new FjTbl();
          fj.obt = anyenum.ObjectType.Event;
          fj.obi = agd.evi;
          sqlparam.push(fj.dTParam());

          let upfjparams = this.sqlparamAddFj(agd.evi, agd.attachments) ;


          nwfj = [...nwfj,...upfjparams];
        }*/

        saved.push(agd);
      }

      let waparams = new Array<any>();
      if (was && was.length > 0){
        waparams = this.sqlExce.getFastSaveSqlByParam(was);
      }
      sqlparam = [...sqlparam, ...waparams];

      /*let fjparams = new Array<any>();

      if (nwfj && nwfj.length > 0){
        fjparams = this.sqlExce.getFastSaveSqlByParam(nwfj) || new Array<any>();
      }

      sqlparam = [...sqlparam, ...fjparams];*/



      await this.sqlExce.batExecSqlByParam(sqlparam);
      this.emitService.emit("mwxing.calendar.activities.changed", saved);
    }

    return saved;
  }

  /**
   * 接收日程数据同步
   *
   * @author leon_xi@163.com
   **/
  async receivedAgenda(evi: any) {

    this.assertEmpty(evi);   // 入参不能为空

    let pull: PullInData = new PullInData();

    if (evi instanceof Array) {
      pull.type = "Agenda";
      pull.d.splice(0, 0, ...evi);
    } else {
      pull.type = "Agenda";
      pull.d.push(evi);
    }

    // 发送下载日程请求
    await this.dataRestful.pull(pull);

    return;
  }

  /**
   * 取得两个日程变化的字段名成数组
   *
   * @param {AgendaData} one
   * @param {AgendaData} another
   * @returns {Array<string>}
   *
   * @author leon_xi@163.com
   */
  changedAgendaFields(one: AgendaData, another: AgendaData): Array<string> {
    assertEmpty(one);   // 入参不能为空
    assertEmpty(another);   // 入参不能为空

    let changed: Array<string> = new Array<string>();

    for (let key of Object.keys(one)) {
      if (["wtt", "utt", "rts", "txs", "fj", "pn", "originator", "tos", "attachments"].indexOf(key) >= 0) continue;   // 忽略字段

      if (one.hasOwnProperty(key)) {
        let value = one[key];

        // 如果两个值都为空, 继续
        if (!value && !another[key]) {
          continue;
        }

        // 如果one的值为空, 不一致
        if (!value || !another[key]) {
          changed.push(key);
          continue;
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          if (typeof value === 'string' && value != "" && another[key] != "" && key == "rt") {
            let onert: RtJson = new RtJson();
            Object.assign(onert, JSON.parse(value));

            let anotherrt: RtJson = new RtJson();
            Object.assign(anotherrt, JSON.parse(another[key]));

            if (!(onert.sameWith(anotherrt))) {
              changed.push(key);
              continue;
            }
          }

          if (typeof value === 'string' && value != "" && another[key] != "" && key == "tx") {
            let onetx: TxJson = new TxJson();
            Object.assign(onetx, JSON.parse(value));

            let anothertx: TxJson = new TxJson();
            Object.assign(anothertx, JSON.parse(another[key]));

            if (!(onetx.sameWith(anothertx))) {
              changed.push(key);
              continue;
            }
          }

          if (value != another[key]) {
            changed.push(key);
            continue;
          }
        }

        if (value instanceof RtJson) {
          let onert: RtJson = new RtJson();
          Object.assign(onert, value);

          let anotherrt: RtJson = new RtJson();
          Object.assign(anotherrt, another[key]);

          if (!(onert.sameWith(anotherrt))) {
            changed.push(key);
            continue;
          }
        }

        if (value instanceof TxJson) {
          let onetx: TxJson = new TxJson();
          Object.assign(onetx, value);

          let anothertx: TxJson = new TxJson();
          Object.assign(anothertx, another[key]);

          if (!(onetx.sameWith(anothertx))) {
            changed.push(key);
            continue;
          }
        }

        if (value instanceof Array) {
          if (value.length != another[key].length) {
            changed.push(key);
            continue;
          }

          if (value.length > 0) {
            if (value[0] && value[0].hasOwnProperty("members") && another[key][0] && another[key][0].hasOwnProperty("members")) {
              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.pari > b.pari) return -1;
                if (a.pari < b.pari) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) {
                changed.push(key);
                continue;
              }

            } else if (value[0] instanceof FjTbl && another[key][0] instanceof FjTbl) {

              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.fji > b.fji) return -1;
                if (a.fji < b.fji) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) {
                changed.push(key);
                continue;
              }

            } else {
              continue; // 非比较字段，忽略
            }
          }
        }
      }
    }

    return changed;
  }

  /**
   * 判断两个日程是否相同
   *
   * @param {AgendaData} one
   * @param {AgendaData} another
   * @returns {boolean}
   *
   * @author leon_xi@163.com
   */
  isSameAgenda(one: AgendaData, another: AgendaData): boolean {
    if (!one || !another) return false;

    for (let key of Object.keys(one)) {
      if (["wtt", "utt", "rts", "txs", "fj", "pn", "originator", "tos", "attachments"].indexOf(key) >= 0) continue;   // 忽略字段

      if (one.hasOwnProperty(key)) {
        let value = one[key];

        // 如果两个值都为空, 继续
        if (!value && !another[key]) {
          continue;
        }

        // 如果one的值为空, 不一致
        if (!value || !another[key]) return false;

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          if (typeof value === 'string' && value != "" && another[key] != "" && key == "rt") {
            let onert: RtJson = new RtJson();
            Object.assign(onert, JSON.parse(value));

            let anotherrt: RtJson = new RtJson();
            Object.assign(anotherrt, JSON.parse(another[key]));

            if (!(onert.sameWith(anotherrt))) return false;

            continue;
          }

          if (typeof value === 'string' && value != "" && another[key] != "" && key == "tx") {
            let onetx: TxJson = new TxJson();
            Object.assign(onetx, JSON.parse(value));

            let anothertx: TxJson = new TxJson();
            Object.assign(anothertx, JSON.parse(another[key]));

            if (!(onetx.sameWith(anothertx))) return false;

            continue;
          }

          if (value != another[key]) return false;
        }

        if (value instanceof RtJson) {
          let onert: RtJson = new RtJson();
          Object.assign(onert, value);

          let anotherrt: RtJson = new RtJson();
          Object.assign(anotherrt, another[key]);

          if (!(onert.sameWith(anotherrt))) return false;

          continue;
        }

        if (value instanceof TxJson) {
          let onetx: TxJson = new TxJson();
          Object.assign(onetx, value);

          let anothertx: TxJson = new TxJson();
          Object.assign(anothertx, another[key]);

          if (!(onetx.sameWith(anothertx))) return false;

          continue;
        }

        if (value instanceof Array) {
          if (value.length != another[key].length) return false;

          if (value.length > 0) {
            if (value[0] && value[0].hasOwnProperty("pari") && another[key][0] && another[key][0].hasOwnProperty("pari")) {
              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.pari > b.pari) return -1;
                if (a.pari < b.pari) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) return false;

            } else if (value[0] instanceof FjTbl && another[key][0] instanceof FjTbl) {

              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.fji > b.fji) return -1;
                if (a.fji < b.fji) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) return false;

            } else {
              return false;
            }
          }
        }

      }
    }

    return true;
  }

  /**
   * 判断两个任务是否相同
   *
   * @param {TaskData} one
   * @param {TaskData} another
   * @returns {boolean}
   *
   * @author leon_xi@163.com
   */
  isSameTask(one: TaskData, another: TaskData): boolean {
    if (!one || !another) return false;

    for (let key of Object.keys(one)) {
      if (["wtt", "utt", "rts", "txs", "fj", "pn", "originator", "tos"].indexOf(key) >= 0) continue;   // 忽略字段

      if (one.hasOwnProperty(key)) {
        let value = one[key];

        // 如果两个值都为空, 继续
        if (!value && !another[key]) {
          continue;
        }

        // 如果one的值为空, 不一致
        if (!value || !another[key]) return false;

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          if (typeof value === 'string' && value != "" && another[key] != "" && key == "rt") {
            let onert: RtJson = new RtJson();
            Object.assign(onert, JSON.parse(value));

            let anotherrt: RtJson = new RtJson();
            Object.assign(anotherrt, JSON.parse(another[key]));

            if (!(onert.sameWith(anotherrt))) return false;

            continue;
          }

          if (typeof value === 'string' && value != "" && another[key] != "" && key == "tx") {
            let onetx: TxJson = new TxJson();
            Object.assign(onetx, JSON.parse(value));

            let anothertx: TxJson = new TxJson();
            Object.assign(anothertx, JSON.parse(another[key]));

            if (!(onetx.sameWith(anothertx))) return false;

            continue;
          }

          if (value != another[key]) return false;
        }

        if (value instanceof RtJson) {
          let onert: RtJson = new RtJson();
          Object.assign(onert, value);

          let anotherrt: RtJson = new RtJson();
          Object.assign(anotherrt, another[key]);

          if (!(onert.sameWith(anotherrt))) return false;

          continue;
        }

        if (value instanceof TxJson) {
          let onetx: TxJson = new TxJson();
          Object.assign(onetx, value);

          let anothertx: TxJson = new TxJson();
          Object.assign(anothertx, another[key]);

          if (!(onetx.sameWith(anothertx))) return false;

          continue;
        }

        if (value instanceof Array) {
          if (value.length != another[key].length) return false;

          if (value.length > 0) {
            if (value[0] && value[0].hasOwnProperty("members") && another[key][0] && another[key][0].hasOwnProperty("members")) {
              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.pari > b.pari) return -1;
                if (a.pari < b.pari) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) return false;

            } else if (value[0] instanceof FjTbl && another[key][0] instanceof FjTbl) {

              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.fji > b.fji) return -1;
                if (a.fji < b.fji) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) return false;

            } else {
              return false;
            }
          }
        }

      }
    }

    return true;
  }

  /**
   * 页面判断重复设置是否改变
   * @param {AgendaData} newAgd
   * @param {AgendaData} oldAgd
   * @returns {boolean}
   */
  isAgendaRepeatChanged(newAgd : AgendaData ,oriAgd : AgendaData): Array<string>{
    let ret = new Array<string>();
    if (!newAgd.rtjson) {
      if (newAgd.rt) {
        newAgd.rtjson = new RtJson();
        Object.assign(newAgd.rtjson, JSON.parse(newAgd.rt));
      } else {
        newAgd.rtjson = new RtJson();
      }
    } else {
      let rtjson: RtJson = new RtJson();
      Object.assign(rtjson, newAgd.rtjson);
      newAgd.rtjson = rtjson;
    }

    if (!oriAgd.rtjson) {
      if (oriAgd.rt) {
        oriAgd.rtjson = new RtJson();
        Object.assign(oriAgd.rtjson, JSON.parse(oriAgd.rt));
      } else {
        oriAgd.rtjson = new RtJson();
      }
    } else {
      let rtjson: RtJson = new RtJson();
      Object.assign(rtjson, oriAgd.rtjson);
      oriAgd.rtjson = rtjson;
    }

    //重复选项发生变化
    if (!newAgd.rtjson.sameWith(oriAgd.rtjson))  ret.push("rt");

    //title发生变化
    if (newAgd.evn != oriAgd.evn){
      ret.push("evn");
  }
    //开始日发生变化
    if (newAgd.sd != oriAgd.sd){
      ret.push("sd");
    }
    if (newAgd.evd != oriAgd.evd){
      ret.push("evd");
    }
    //开始时间发生变化
    if (newAgd.st != oriAgd.st){
      ret.push("st");
    }
    //全天条件发生变化
    if (newAgd.al != oriAgd.al){
      ret.push("al");
    }

    //时长发生变化
    if (newAgd.ct != oriAgd.ct){
      ret.push("ct");
    }
    return ret;
  }

  /**
   * 判断日程修改是否需要确认
   * 当前日程修改 还是 将来日程全部修改
   *
   * @param {AgendaData} newAgd
   * @param {AgendaData} oldAgd
   * @returns {boolean}
   */
  hasAgendaModifyConfirm(before: AgendaData, after: AgendaData): ConfirmType {
    assertEmpty(before);  // 入参不能为空
    assertEmpty(after);  // 入参不能为空

    let confirm: ConfirmType = ConfirmType.None;

    // 确认修改前日程是否重复
    if (before.rfg != RepeatFlag.Repeat) return confirm;

    for (let key of Object.keys(before)) {
      if (["sd","evd", "st", "al", "ct", "evn", "rt", "rtjson"].indexOf(key) >= 0) {   // 比较字段
        let value = before[key];

        // 如果两个值都为空, 继续
        if (!value && !after[key]) {
          continue;
        }

        // 如果one的值为空, 不一致
        if (!value || !after[key]) {
          if (confirm == ConfirmType.None) {
            confirm = ConfirmType.CurrentOrFutureAll;
          } else if (confirm == ConfirmType.All) {
            confirm = ConfirmType.FutureAll;
          }

          continue;
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          if (typeof value === 'string' && value != "" && after[key] != "" && key == "rt") {
            let onert: RtJson = new RtJson();
            Object.assign(onert, JSON.parse(value));

            let anotherrt: RtJson = new RtJson();
            Object.assign(anotherrt, JSON.parse(after[key]));

            if (!(onert.sameWith(anotherrt))) {
              if (confirm == ConfirmType.None) {
                // 如果修改为不重复,提示当前或将来所有
                if (anotherrt.cycletype == CycleType.close) {
                  confirm = ConfirmType.CurrentOrFutureAll;
                } else {  // 否则不提示
                  confirm = ConfirmType.All;
                }
              } else if (confirm == ConfirmType.CurrentOrFutureAll) {
                confirm = ConfirmType.FutureAll;
              }
            }

            continue;
          }

          if (value != after[key]) {
            if (confirm == ConfirmType.None) {
              confirm = ConfirmType.CurrentOrFutureAll;
            } else if (confirm == ConfirmType.All) {
              confirm = ConfirmType.FutureAll;
            }

            continue;
          }
        }

        if (value instanceof RtJson) {
          let onert: RtJson = new RtJson();
          Object.assign(onert, value);

          let anotherrt: RtJson = new RtJson();
          Object.assign(anotherrt, after[key]);

          if (!(onert.sameWith(anotherrt))) {
            if (confirm == ConfirmType.None) {
              // 如果修改为不重复,提示当前或将来所有
              if (anotherrt.cycletype == CycleType.close) {
                confirm = ConfirmType.CurrentOrFutureAll;
              } else {  // 否则不提示
                confirm = ConfirmType.All;
              }
            } else if (confirm == ConfirmType.CurrentOrFutureAll) {
              confirm = ConfirmType.FutureAll;
            }
          }

          continue;
        }
      }
    }

    return confirm;
  }

  /**
   * 判断任务修改是否需要确认
   * 当前任务修改 还是 将来任务全部修改
   *
   * @param {TaskData} before
   * @param {TaskData} after
   * @returns {boolean}
   */
  hasTaskModifyConfirm(before: TaskData, after: TaskData): ConfirmType {
    assertEmpty(before);  // 入参不能为空
    assertEmpty(after);  // 入参不能为空

    let confirm: ConfirmType = ConfirmType.None;

    // 确认修改前日程是否重复
    if (before.rfg != RepeatFlag.Repeat) return confirm;

    for (let key of Object.keys(before)) {
      if (["sd", "st", "evn", "rt", "rtjson"].indexOf(key) >= 0) {   // 比较字段
        let value = before[key];

        // 如果两个值都为空, 继续
        if (!value && !after[key]) {
          continue;
        }

        // 如果one的值为空, 不一致
        if (!value || !after[key]) {
          if (confirm == ConfirmType.None) {
            confirm = ConfirmType.CurrentOrFutureAll;
          } else if (confirm == ConfirmType.All) {
            confirm = ConfirmType.FutureAll;
          }

          continue;
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          if (typeof value === 'string' && value != "" && after[key] != "" && key == "rt") {
            let onert: RtJson = new RtJson();
            Object.assign(onert, JSON.parse(value));

            let anotherrt: RtJson = new RtJson();
            Object.assign(anotherrt, JSON.parse(after[key]));

            if (!(onert.sameWith(anotherrt))) {
              if (confirm == ConfirmType.None) {
                confirm = ConfirmType.All;
              } else if (confirm == ConfirmType.CurrentOrFutureAll) {
                confirm = ConfirmType.FutureAll;
              }
            }

            continue;
          }

          if (value != after[key]) {
            if (confirm == ConfirmType.None) {
              confirm = ConfirmType.CurrentOrFutureAll;
            } else if (confirm == ConfirmType.All) {
              confirm = ConfirmType.FutureAll;
            }

            continue;
          }
        }

        if (value instanceof RtJson) {
          let onert: RtJson = new RtJson();
          Object.assign(onert, value);

          let anotherrt: RtJson = new RtJson();
          Object.assign(anotherrt, after[key]);

          if (!(onert.sameWith(anotherrt))) {
            if (confirm == ConfirmType.None) {
              confirm = ConfirmType.All;
            } else if (confirm == ConfirmType.CurrentOrFutureAll) {
              confirm = ConfirmType.FutureAll;
            }
          }

          continue;
        }
      }
    }

    return confirm;
  }

  /**
   * 页面判断重复设置是否改变
   * @param {AgendaData} newAgd
   * @param {AgendaData} oldAgd
   * @returns {boolean}
   */
  hasAgendaModifyDo(newAgd : AgendaData ,oriAgd : AgendaData ,modiType : anyenum.OperateType):DoType {

    let changed : Array<string> = this.isAgendaRepeatChanged(newAgd,oriAgd);

    let doType  = DoType.Local;

    if (changed.length > 0) {
      //重复设定

      /* 修改场景：
      *  非重复事件to非重复、重复事件中的某一日程to独立日程
      * `修改重复事件to重复事件、非重复事件to重复事件
      */
      //非重复事件to非重复
      if (oriAgd.rfg == anyenum.RepeatFlag.NonRepeat && newAgd.rtjson.cycletype == anyenum.CycleType.close) {
        doType = DoType.Current;
      }
      //非重复事件to重复事件
      if (oriAgd.rfg == anyenum.RepeatFlag.NonRepeat && newAgd.rtjson.cycletype != anyenum.CycleType.close) {
        doType = DoType.FutureAll;
      }
      //重复事件中的某一日程to独立日程
      if (oriAgd.rfg == anyenum.RepeatFlag.Repeat && modiType == anyenum.OperateType.OnlySel) {
        doType = DoType.Current;
        //如果是修改重复选项
        if (changed.length == 1 && changed[0] == "rt"){
          doType = DoType.All;
        }
      }
      //重复事件to重复事件或非重复
      if (oriAgd.rfg == anyenum.RepeatFlag.Repeat && modiType == anyenum.OperateType.FromSel) {
        doType = DoType.FutureAll;
      }
    }else if( newAgd.invitestatus != oriAgd.invitestatus ) {
      doType = DoType.Invite;
    }else {
      doType = DoType.Local;
    }
    return doType;
  }

  /**
   * 取得日程相关所有信息
  * @param {string} evi
   * @returns {Promise<Array<AgendaData>>}
   */
  async getAgenda(evi : string , getdel : boolean = false):Promise<AgendaData>{

    this.assertEmpty(evi);    // 入参不能为空

    let agdata = {} as AgendaData;
    let delcondi = "";
    let params = new Array<any>();
    //获取事件详情

    let sql: string = ` select * from gtd_ev where evi = ?  `;
    params.push(evi);
    if (!getdel){
      sql = sql + ` and del = ? `;
      params.push(DelType.undel);
    }
    let ev: EvTbl = await this.sqlExce.getExtOneByParam<EvTbl>(sql, params);

    // 如果事件不存在
    if (!ev) {
      return null;
    }

    Object.assign(agdata , ev);
    agdata.rtjson = new RtJson();
    Object.assign(agdata.rtjson , JSON.parse(agdata.rt));
    agdata.txjson = new TxJson();
    Object.assign(agdata.txjson , JSON.parse(agdata.tx));

    //主evi设定
    let masterEvi : string;
    let parEvi : string;
    if (agdata.rtevi == ""){
      //非重复数据或重复数据的父记录
      masterEvi = agdata.evi;
      parEvi = agdata.evi;
    }else if (agdata.rfg == anyenum.RepeatFlag.RepeatToOnly){
      //重复中独立数据
      masterEvi = agdata.evi;
      parEvi = agdata.rtevi;
    }else{
      //重复数据
      masterEvi = agdata.rtevi;
      parEvi = agdata.rtevi;
    }

    //取得日程表详情
    let ca = new CaTbl();
    ca.evi = masterEvi;
    ca = await  this.sqlExce.getOneByParam<CaTbl>(ca);
    if (ca){
      agdata.sd = ca.sd ;
      agdata.st = ca.st ;
      agdata.ed = ca.ed ;
      agdata.et = ca.et ;
      agdata.al = ca.al ;
      agdata.ct = ca.ct ;
    }

    //取得计划详情
    let jha = new JhaTbl();
    jha.ji = agdata.ji;
    jha = await this.sqlExce.getOneByParam<JhaTbl>(jha);
    agdata.jha = jha;

    //附件数据
    let fj = new FjTbl();
    fj.obi = agdata.evi;
    fj.obt = anyenum.ObjectType.Event;
    fj.del = anyenum.DelType.undel;
    let attachments = new Array<Attachment>();
    attachments = await this.sqlExce.getLstByParam<Attachment>(fj);
    agdata.attachments = attachments;
    //附件数量
    if (attachments != null){
      agdata.fj = attachments.length +"";
    }else{
      agdata.fj = 0 + "";
    }


    if(agdata.gs == '0'){
      //共享人信息
      agdata.members = await this.getMemberByEvi(parEvi);
      //参与人数量
      if (agdata.members !=null){
        agdata.pn = agdata.members.length ;
      }else{
        agdata.pn = 0 ;
      }
    }

    if(agdata.gs == '1'){
      //发起人信息
      agdata.originator = await this.getMemberByUi(agdata.ui);
    }
    return agdata;

  }

  /**
   * 根据事件Id获取联系人信息
   * @returns {Promise<Array<Member>>}
   */
  private async getMemberByEvi(evi:string):Promise<Array<Member>>{
    let members: Array<Member> =new Array<Member>();
    //共享人信息
    let pars: Array<ParTbl> = new Array<ParTbl>();
    let par = new ParTbl();
    par.obi = evi;
    par.obt = anyenum.ObjectType.Event;
    pars = await this.sqlExce.getLstByParam<ParTbl>(par);
    for (let j = 0, len = pars.length; j < len; j++) {
      let member = {} as Member;
      Object.assign(member,pars[j]);
      let fs : FsData;
      fs = this.userConfig.GetOneBTbl(pars[j].pwi);
      if(fs && fs != null){
        Object.assign(member,fs);

      }
      members.push(member);
    }
    return members;
  }

  /**
   * 根据用户Id获取联系人信息
   * @returns {Promise<Member>}
   */
  private async getMemberByUi(ui:string):Promise<Member>{
    let member = {} as Member;
    let fs : FsData;
    //发起人信息
    fs = this.userConfig.GetOneBTbl(ui);
    if (fs  && fs != null) {
      Object.assign(member,fs);
    }else{
      //不存在查询数据库
      let b = new BTbl();
      b.ui = ui;
      b = await this.sqlExce.getExtOne<BTbl>(b.slT());
      if(b != null){
        Object.assign(member, b);
        member.bhiu = DataConfig.HUIBASE64;
      }else{
        console.error("=======PgbusiService 获取发起人失败 =======")
      }
    }
    return member;
  }

  /**
   * 删除事件
   * @param {AgendaData} oriAgdata
   * @param {OperateType} delType
   * 重复事件删除，选仅删除当前事件使用OperateType.OnlySel，选从删除日程开始修改使用OperateType.FromSel，
   * 其他事件删除使用OperateType.FromSel，
   * @returns {Promise<Array<AgendaData>>}
   */
  async removeAgenda(oriAgdata : AgendaData, delType : anyenum.OperateType):Promise<Array<AgendaData>>{

    if (delType == anyenum.OperateType.FromSel && oriAgdata.rfg == anyenum.RepeatFlag.RepeatToOnly){
      this.assertFail("独立日删除不可以选择删除将来所有");
    }

    let outAgds = new Array<AgendaData>();

    //批量本地更新
    let sqlparam = new Array<any>();
    let params : Array<any>;

    //主evi设定
    let delEvi : string;
    if (oriAgdata.rtevi == ""){
      //非重复数据或重复数据的父记录
      delEvi = oriAgdata.evi;
    }else if (oriAgdata.rfg == anyenum.RepeatFlag.RepeatToOnly){
      //重复中独立日只能删自己
      delEvi = oriAgdata.evi;
    }else{
      //重复数据
      delEvi = oriAgdata.rtevi;
    }

    if (delType == anyenum.OperateType.FromSel){

      //删除原事件中从当前开始所有事件
      console.log("**** removeAgenda start :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
      await this.delFromsel(delEvi ,oriAgdata ,sqlparam,outAgds);
      console.log("**** removeAgenda end :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
    }else{

      let sq : string;
      let outAgd = {} as AgendaData;
      let tos : string;//需要发送的参与人手机号
      tos = this.getMemberPhone(oriAgdata.members);

      //事件对象放入返回事件
      Object.assign(outAgd,oriAgdata);
      outAgd.del = anyenum.DelType.del;
      outAgd.tb = anyenum.SyncType.unsynch;
      outAgd.mi = UserConfig.account.id;
      outAgd.tos = tos;//需要发送的参与人

      //删除事件表数据
      let ev = new EvTbl();
      ev.evi = outAgd.evi;
      ev.del = outAgd.del;
      ev.tb = outAgd.tb;
      ev.mi = outAgd.mi;
      sqlparam.push(ev.upTParam());

      outAgds.push(outAgd);

      //如果当前删除对象是父事件，则为当前重复事件重建新的父事件，值为ev表重复记录里的第一条做为父事件
      await this.changedParentAgdForOther(oriAgdata,oriAgdata.members,sqlparam,outAgds);



      // 删除相关提醒
      sq = `update gtd_wa set tb = ? ,del = ?  where obi = ? and obt = ?; `;
      params = new Array<any>();
      params.push(anyenum.SyncType.unsynch);
      params.push(anyenum.DelType.del);
      params.push(oriAgdata.evi);
      params.push(anyenum.ObjectType.Event);
      sqlparam.push([sq,params]);

    }

    await this.sqlExce.batExecSqlByParam(sqlparam);

    this.emitService.emit("mwxing.calendar.activities.changed", outAgds);
    this.syncAgendas(outAgds);

    return outAgds;
  }

  /**
   * 保存或修改事件
   * @param {AgendaData} newAgdata 新事件详情
   * @param {AgendaData} oriAgdata 原事件详情 修改场合必须传入
   * @param {OperateType} modiType
   * 重复事件修改，选仅修改当前事件使用OperateType.OnlySel，选从当前日程开始修改使用OperateType.FromSel，
   * 其他事件修改使用OperateType.FromSel，
   * 新建事件使用 OperateType.Non
   * @returns {Promise<Array<AgendaData>>}
   */
  async saveAgenda(newAgdata : AgendaData, oriAgdata:AgendaData = null, modiType : anyenum.OperateType = anyenum.OperateType.Non): Promise<Array<AgendaData>> {
    // 入参不能为空
    this.assertEmpty(newAgdata);
    this.assertEmpty(newAgdata.sd);    // 事件开始日期不能为空
    this.assertEmpty(newAgdata.evn);   // 事件标题不能为空

    if (!newAgdata.evi || newAgdata.evi == "") {
      if (newAgdata.rtjson || newAgdata.rt || newAgdata.rts) {
        this.assertEmpty(newAgdata.rtjson);  // 新建事件重复设置不能为空
      } else {
        newAgdata.rtjson = new RtJson();
      }

      if (newAgdata.txjson || newAgdata.tx || newAgdata.txs) {
        this.assertEmpty(newAgdata.txjson);  // 新建事件提醒不能为空
      } else {
        newAgdata.txjson = new TxJson();
      }
    }

    if (newAgdata.evi != null && newAgdata.evi != "") {
      /*修改*/
      this.assertNull(oriAgdata);   // 原始事件详情不能为空

      if (newAgdata.rtjson.cycletype != anyenum.CycleType.close && oriAgdata.rfg == anyenum.RepeatFlag.RepeatToOnly){
        this.assertFail("独立日不允许设定重复");
      }

      console.log("**** updateAgenda start :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
      let outAgdatas = await this.updateAgenda(newAgdata,oriAgdata,modiType);
      console.log("**** updateAgenda end :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))

      this.emitService.emit("mwxing.calendar.activities.changed", outAgdatas);
      this.syncAgendas(outAgdatas);

      return outAgdatas;

    } else {

      /*新增*/
      let retParamEv = new RetParamEv();
      console.log("**** newAgenda start :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
      retParamEv = this.newAgenda(newAgdata);
      console.log("**** newAgenda end :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))

      await this.sqlExce.batExecSqlByParam(retParamEv.sqlparam);
      //提交服务器


      //如果网络正常提交到服务器，则更新同步标志同步通过websocket来通知

      this.emitService.emitRef(newAgdata.sd);

      this.emitService.emit("mwxing.calendar.activities.changed", retParamEv.outAgdatas);
      this.syncAgendas(retParamEv.outAgdatas);

      return retParamEv.outAgdatas;
    }
  }

  /**
   * 新增事件
   * @param {AgendaData} agdata
   * @returns {Promise<Array<AgendaData>>}
   */
  private newAgenda(agdata: AgendaData):RetParamEv {

    //设置页面参数初始化
    this.initAgdParam(agdata);
    //console.log(JSON.stringify(agdata));

    let sqlparam = new Array<any>();

    //事件sqlparam 及提醒sqlparam及附件
    let retParamEv = new RetParamEv();

    console.log("**** newAgenda sqlparamAddEv2 start :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
    retParamEv = this.sqlparamAddEv2(agdata);
    console.log("**** newAgenda sqlparamAddEv2 end :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
    //console.log(JSON.stringify(retParamEv));


    //日程表sqlparam

    let caparam = new CaTbl();
    if (retParamEv.rtevi != ""){
      caparam = this.sqlparamAddCa(retParamEv.rtevi,agdata);
      sqlparam.push(caparam.rpTParam());
    }

    let tos : string;//需要发送的参与人手机号
    tos = this.getMemberPhone(agdata.members);

    //日程表信息，参与人及附件信息放入返回事件的每条记录信息中
    for (let j = 0, len = retParamEv.outAgdatas.length; j < len ; j++){
      let outAgd = {} as AgendaData;
      outAgd = retParamEv.outAgdatas[j];

      let tmpevi = outAgd.evi;
      Object.assign(outAgd,caparam);
      outAgd.evi = tmpevi;

      outAgd.members = agdata.members;
      if (j == 0){
        outAgd.attachments = agdata.attachments;
      }
      outAgd.tos = tos;

    }

    //批量本地入库
    retParamEv.sqlparam = [...sqlparam, ...retParamEv.sqlparam];
    return retParamEv;
  }

  /**
   * 更新事件
   * @param {AgendaData} newAgdata
   * @param {AgendaData} oriAgdata
   * @param {OperateType} modiType
   * @returns {Promise<Array<AgendaData>>}
   */
  private async updateAgenda(newAgdata: AgendaData,oriAgdata : AgendaData, modiType : anyenum.OperateType):Promise<Array<AgendaData>> {

    if (modiType == anyenum.OperateType.FromSel && oriAgdata.rfg == anyenum.RepeatFlag.RepeatToOnly){
      this.assertFail("独立日修改不可以选择修改将来所有");
    }

    //如果不使用页面对象，而直接使用更新后的返回数据对象作为参数，则rtjson，txjson为空
    if (!newAgdata.rtjson) {
      if (newAgdata.rt) {
        newAgdata.rtjson = new RtJson();
        Object.assign(newAgdata.rtjson, JSON.parse(newAgdata.rt));
      } else {
        newAgdata.rtjson = new RtJson();
      }
    }

    if (!oriAgdata.rtjson) {
      if (oriAgdata.rt) {
        oriAgdata.rtjson = new RtJson();
        Object.assign(oriAgdata.rtjson, JSON.parse(oriAgdata.rt));
      } else {
        oriAgdata.rtjson = new RtJson();
      }
    }

    if (!newAgdata.txjson) {
      if (newAgdata.tx) {
        newAgdata.txjson = new TxJson();
        Object.assign(newAgdata.txjson, JSON.parse(newAgdata.tx));
      } else {
        newAgdata.txjson = new TxJson();
      }
    } else {
      let txjson: TxJson = new TxJson();
      Object.assign(txjson, newAgdata.txjson);
      newAgdata.txjson = txjson;
    }

    //批量本地更新
    let sqlparam = new Array<any>();

    let sq: string ;
    let tmpsq : string;
    let outAgds = new Array<AgendaData>();//返回事件
    let params : Array<any>;
    let doType : DoType;

    doType = this.hasAgendaModifyDo(newAgdata,oriAgdata,modiType);
    newAgdata.tb = anyenum.SyncType.unsynch;

    let tos : string;//需要发送的参与人手机号
    tos = this.getMemberPhone(newAgdata.members);

    newAgdata.mi = UserConfig.account.id;

    //主evi设定
    let masterEvi : string;
    let delEvi : string;
    if (oriAgdata.rtevi == ""){
      //非重复数据或重复数据的父记录
      masterEvi = oriAgdata.evi;
      delEvi = oriAgdata.evi;
    }else if (oriAgdata.rfg == anyenum.RepeatFlag.RepeatToOnly){
      //重复中独立日只能修改自己
      masterEvi = oriAgdata.rtevi;

      delEvi = oriAgdata.evi;
    }else{
      //重复数据
      masterEvi = oriAgdata.rtevi;

      delEvi = oriAgdata.rtevi;
    }

    //接收或拒绝邀请
    if (doType == DoType.Invite){

      //邀请状态处理
      if (newAgdata.invitestatus == anyenum.InviteState.Rejected){
        sq = ` update gtd_ev set invitestatus = ?1 ,del = ?2  where evi = ?3 or rtevi = ?3 ; `;
        params = new Array<any>();
        params.push(newAgdata.invitestatus);
        params.push(anyenum.DelType.del);
        params.push(masterEvi);

      }else{
        sq = ` update gtd_ev set invitestatus = ?1  where evi = ?2 or rtevi = ?2 ; `;
        params = new Array<any>();
        params.push(newAgdata.invitestatus);
        params.push(masterEvi);
      }
      sqlparam.push([sq,params]);
      await this.sqlExce.batExecSqlByParam(sqlparam);

      await this.getAllAgendaForFieldChanged(oriAgdata,newAgdata,FieldChanged.Invite,"", outAgds);

      return outAgds;
    }

    //判断进行本地更新
    if (doType == DoType.Local){

      newAgdata.tx = JSON.stringify(newAgdata.txjson);
      newAgdata.txs = newAgdata.txjson.text();
      let ev = new EvTbl();
      Object.assign(ev,newAgdata);
      ev.evi = oriAgdata.evi;
      sqlparam.push(ev.upTParam());

      let caparam = new CaTbl();
      caparam = this.sqlparamAddCa(oriAgdata.evi ,newAgdata);//evi使用原evi
      sqlparam.push(caparam.rpTParam());

      //其他表相关处理
      this.modifyOnlyoneForOther(sqlparam,oriAgdata,newAgdata);

      //todolist处理
      if (newAgdata.todolist != oriAgdata.todolist){

        params = new Array<any>();
        params.push(newAgdata.todolist);
        if (newAgdata.todolist == anyenum.ToDoListStatus.On){
          tmpsq = " , wc = ? ";
          params.push(anyenum.EventFinishStatus.NonFinish);

        }else{
          tmpsq = "";
        }
        params.push(masterEvi);
        params.push(masterEvi);
        sq = ` update gtd_ev set todolist = ?  ${tmpsq} where evi = ? or rtevi = ?  `;
        sqlparam.push([sq,params]);
      }
      //计划处理
      if (newAgdata.ji != oriAgdata.ji){

        sq = ` update gtd_ev set ji = ?  where evi = ? or rtevi = ?  `;

        params = new Array<any>();
        params.push(newAgdata.ji);
        params.push(masterEvi);
        params.push(masterEvi);
        sqlparam.push([sq,params]);
      }

      await this.sqlExce.batExecSqlByParam(sqlparam);
      newAgdata.tos = tos;
      outAgds.push(newAgdata);

      let getall : boolean = false;
      getall = await this.getAllAgendaForFieldChanged(oriAgdata,newAgdata,FieldChanged.Ji,oriAgdata.evi, outAgds);

      //取到所有记录只需要一次
      //如果参与人改变，则获取活动的所有记录上传
      if (!getall){
        getall = await this.getAllAgendaForFieldChanged(oriAgdata,newAgdata,FieldChanged.Member, oriAgdata.evi,outAgds);
      }
      if (!getall){
        await this.getAllAgendaForFieldChanged(oriAgdata,newAgdata,FieldChanged.Todolist,oriAgdata.evi,outAgds);
      }

      //todolist 修改，修改系统提醒
      let was = new Array<WaTbl>();
      let waparams = new Array<any>();
      if (newAgdata.todolist != oriAgdata.todolist){
        if (ev.todolist == anyenum.ToDoListStatus.On ) {
          for ( let agd of outAgds ){
            let ev = new EvTbl();

            Object.assign(ev, agd);
            //如果在todolist中，则加系统提醒
            was.push(this.sqlparamAddSysTx2(ev,anyenum.ObjectType.Event));

          }
          if (was && was.length > 0){
            waparams = this.sqlExce.getFastSaveSqlByParam(was);
          }

        }else{
          sq = `update gtd_wa set tb = ? ,del = ?  where obt = ? and  evi in (select evi from gtd_ev
          where  evi = ? or rtevi =  ? ); `;

          params = new Array<any>();
          params.push(anyenum.SyncType.unsynch);
          params.push(anyenum.DelType.del);
          params.push(anyenum.ObjectType.Event);
          params.push(masterEvi);
          params.push(masterEvi);
          waparams.push([sq,params]);
        }
        await this.sqlExce.batExecSqlByParam(waparams);
      }
      return outAgds;
    }



    /*如果只改当天，则
    1.修改当前数据内容 2.日程表新增一条对应数据 3重建相关提醒
    如果改变从当前所有，则
    1.改变原日程结束日 2.删除从当前所有事件及相关提醒 3.新建新事件日程*/
    if (doType == DoType.FutureAll){

      //删除原事件中从当前开始所有事件
      console.log("**** updateAgenda delFromsel start :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
      await this.delFromsel(delEvi ,oriAgdata ,sqlparam,outAgds);
      console.log("**** updateAgenda delFromsel end :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
      //新建新事件日程
      let nwAgdata = {} as AgendaData;
      Object.assign(nwAgdata ,newAgdata );
      nwAgdata.sd = nwAgdata.evd;

      let retParamEv = new RetParamEv();
      console.log("**** updateAgenda newAgenda start :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
      retParamEv = this.newAgenda(nwAgdata);
      console.log("**** updateAgenda newAgenda end :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
      //添加新参与人到新事件
      let nwpar = new Array<any>();
      nwpar = this.sqlparamAddPar(retParamEv.rtevi , newAgdata.members);

      sqlparam = [...sqlparam, ...retParamEv.sqlparam, ...nwpar];

      //修改与新增记录合并成返回事件

      console.log("**** updateAgenda outAgds = [...outAgds, ...retParamEv.outAgdatas]; start :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
      outAgds = [ ...retParamEv.outAgdatas,...outAgds];
      console.log("**** updateAgenda outAgds = [...outAgds, ...retParamEv.outAgdatas]; end :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))

      await this.sqlExce.batExecSqlByParam(sqlparam);

      return outAgds;
    }

    if(doType == DoType.All){


      //删除原事件中从当前开始所有事件
      oriAgdata.evd = oriAgdata.sd;
      await this.delFromsel(delEvi ,oriAgdata ,sqlparam,outAgds);

      //重建事件日程
      let retParamEv = new RetParamEv();
      newAgdata.sd = oriAgdata.sd;
      retParamEv = this.newAgenda(newAgdata);

      //添加新参与人到新事件
      let nwpar = new Array<any>();
      nwpar = this.sqlparamAddPar(retParamEv.rtevi , newAgdata.members);

      sqlparam = [...sqlparam, ...retParamEv.sqlparam, ...nwpar];

      //修改与新增记录合并成返回事件
      outAgds = [ ...retParamEv.outAgdatas,...outAgds];


      await this.sqlExce.batExecSqlByParam(sqlparam);

      return outAgds;
    }

    if(doType == DoType.Current ) {

      //事件表更新
      let outAgd  = {} as AgendaData;
      let was = new Array<WaTbl>();

      //字段evt 设定

      newAgdata.evt = newAgdata.st;


      let rtjon = new RtJson();
      rtjon.cycletype = anyenum.CycleType.close;
      rtjon.over.value = "";
      rtjon.over.type = anyenum.OverType.fornever;
      rtjon.cyclenum = 1;
      rtjon.openway = new Array<number>();
      newAgdata.rt = JSON.stringify(rtjon);
      newAgdata.rts = rtjon.text() ;

      if (oriAgdata.rfg == anyenum.RepeatFlag.Repeat){
        newAgdata.rfg = anyenum.RepeatFlag.RepeatToOnly;
      }

      newAgdata.tx = JSON.stringify(newAgdata.txjson);
      newAgdata.txs = newAgdata.txjson.text();
      newAgdata.tb = anyenum.SyncType.unsynch;
      let ev = new EvTbl();
      Object.assign(ev,newAgdata);
      ev.evi = oriAgdata.evi;//evi使用原evi
      sqlparam.push(ev.upTParam());

      //事件对象的日程，放入返回事件(单条数据附件，参与人已有)
      Object.assign(outAgd,newAgdata);
      outAgd.evi = ev.evi;

      outAgd.tos = tos;//需要发送的参与人

      outAgds.push(outAgd);

      //其他表相关处理
      this.modifyOnlyoneForOther(sqlparam,oriAgdata,newAgdata);

      //如果当前更新对象是父节点，则为当前重复日程重建新的父记录，值为ev表里的第一条做为父记录
      console.log("**** updateAgenda changedParentAgdForOther start :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
      let isParent : boolean = false;
      isParent = await this.changedParentAgdForOther(oriAgdata,newAgdata.members,sqlparam,outAgds);
      console.log("**** updateAgenda changedParentAgdForOther end :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))

      //日程表新建或更新,修改为独立日的也需要为自己创建对应的日程
      let caparam = new CaTbl();
      caparam = this.sqlparamAddCa(oriAgdata.evi ,newAgdata);//evi使用原evi
      sqlparam.push(caparam.rpTParam());

      //变化或新增的日程放入事件对象
      Object.assign(outAgd,caparam);

      await this.sqlExce.batExecSqlByParam(sqlparam);

      if (!isParent){
        //如果不是父点且参与人发生改变，取得活动所有数据
        let getall : boolean = false;
        getall = await this.getAllAgendaForFieldChanged(oriAgdata,newAgdata,FieldChanged.Member,outAgd.evi,outAgds);
        if (!getall){
          getall = await this.getAllAgendaForFieldChanged(oriAgdata,newAgdata,FieldChanged.Ji,outAgd.evi,outAgds);
        }
        if (!getall){
          await this.getAllAgendaForFieldChanged(oriAgdata,newAgdata,FieldChanged.Todolist,outAgd.evi,outAgds);
        }
      }

      return outAgds;

    }

    return outAgds;
  }

  /**
   * 单独更新单条记录时，如果指定字段改变则需要提交活动所有记录到服务器
   * @param {AgendaData} oriAgdata
   * @param {AgendaData} newAgdata
   * @param {FieldChanged} fieldChanged
   * @param {string} ignoreEvi
   * @param {Array<AgendaData>} outAgds
   * @returns {Promise<boolean>}
   */
  private async getAllAgendaForFieldChanged(oriAgdata :AgendaData, newAgdata : AgendaData,
                                            fieldChanged : FieldChanged ,ignoreEvi : string ,
                                            outAgds : Array<AgendaData>):
  Promise<boolean>{
    let retAgendas = new Array<AgendaData>();
    let ret : boolean = false;
    let changed : boolean =  false;
    let tmpcondi = "";

    //除了接受拒绝，其他非重复数(调用前已放入返回数组中)据不需要获取所有数据
    if (fieldChanged != FieldChanged.Invite && oriAgdata.rfg == anyenum.RepeatFlag.NonRepeat){
      return ret;
    }

    let sq : string ;
    let tos : string;//需要发送的参与人手机号
    //主evi设定
    let masterEvi : string;
    if (oriAgdata.rtevi == ""){
      //非重复数据或重复数据的父记录
      masterEvi = oriAgdata.evi;
    }else {
      //重复数据（包含独立日数据）
      masterEvi = oriAgdata.rtevi;
    }

    switch (fieldChanged){
      case FieldChanged.Invite:
        tmpcondi = ` `;
        changed = true;
        break;
      case FieldChanged.Ji :
        if (oriAgdata.ji != newAgdata.ji){
          tmpcondi = ` and del <> 'del'   and evi <> '${ignoreEvi}' `;
          changed = true;
        }
        break;
      case FieldChanged.Todolist:
        if (oriAgdata.todolist != newAgdata.todolist){
          tmpcondi = ` and del <> 'del'   and evi <> '${ignoreEvi}' `;
          changed = true;
        }
        break;
      case FieldChanged.Member:
        tmpcondi = ` and del <> 'del'   and evi <> '${ignoreEvi}' `;

        if (!oriAgdata.members ){
          oriAgdata.members = new Array<Member>();
        }
        if (!newAgdata.members ){
          newAgdata.members = new Array<Member>();
        }
        if (oriAgdata.members.length != newAgdata.members.length){
          changed = true;
        }else {
          for (let oriMember of   oriAgdata.members){
            let findm =  newAgdata.members.find((value, index,arr)=>{
              return value.pari == oriMember.pari || value.ui == oriMember.ui || value.rc == oriMember.rc;
            });
            if (!findm){
              changed = true;
              break;
            }
          }
        }
        break;
      default:
        break;
    }



    if (changed ){
      ret = true;
      tos = this.getMemberPhone(newAgdata.members);
      sq = `select ev.*, ca.sd, ca.ed, ca.st, ca.et, ca.al, ca.ct
                        from (select *,
                        case when rfg = '2' then evi
                             when ifnull(rtevi, '') = '' then evi
                             else rtevi end forcaevi
                          from gtd_ev
                          where (evi = ?1 or rtevi = ?1)   ${tmpcondi}  ) ev
                        left join gtd_ca ca
                        on ca.evi = ev.forcaevi ;`;
      retAgendas = await this.sqlExce.getExtLstByParam<AgendaData>(sq, [masterEvi]) || retAgendas;


      //取得相关的附件
      let attachs = new Array<Attachment>();
      sq = `select * from gtd_fj where obt = ?1 and  obi in (select evi
      from gtd_ev  where (evi = ?2 or rtevi = ?2)    ${tmpcondi} ); `;
      attachs = await this.sqlExce.getExtLstByParam<Attachment>(sq,[anyenum.ObjectType.Event,masterEvi]);

      //活动其他对象绑定
      for (let agd of retAgendas){

        agd.members = newAgdata.members;//参与人
        agd.pn = agd.members.length;
        agd.tos = tos;
        //附件
        if (attachs && attachs.length > 0){
          agd.attachments = attachs.filter((value,index,arr)=>{
            return agd.evi == value.obi;
          })
        }
      }

      Object.assign(outAgds , [...outAgds, ...retAgendas]);
    }
    return ret;
  }

  /**
   * 如果只修改单一记录，对提醒，参与人，附件进行先删除再新增操作
   * @param {Array<any>} sqlparam
   * @param {AgendaData} oriAgdata
   * @param {AgendaData} newAgdata
   */
  private modifyOnlyoneForOther(sqlparam : Array<any> ,oriAgdata :AgendaData, newAgdata : AgendaData){
    let sq = "";
    let params : Array<any>;
    //取参与人evi设定
    let parEvi : string;
    if (oriAgdata.rtevi == ""){
      //非重复数据或重复数据的父记录
      parEvi = oriAgdata.evi;
    }else {
      //重复数据(此处包含独立日)
      parEvi = oriAgdata.rtevi;
    }

    // 删除相关提醒
    sq = `update gtd_wa set tb = ? ,del = ?  where  obi = ? and obt = ?; `;
    params = new Array<any>();
    params.push(anyenum.SyncType.unsynch);
    params.push(anyenum.DelType.del);
    params.push(oriAgdata.evi);
    params.push(anyenum.ObjectType.Event);
    sqlparam.push([sq,params]);

    let ev = new EvTbl();
    Object.assign(ev,newAgdata);
    //提醒新建
    let was = new Array<WaTbl>();
    let waparams = new Array<any>();

    if (ev.todolist == anyenum.ToDoListStatus.On ) {
      //如果在todolist中，则加系统提醒
      was.push(this.sqlparamAddSysTx2(ev,anyenum.ObjectType.Event));
    }else{
      let wa = new WaTbl();
      wa.wai = ev.evi;
      wa.tb = anyenum.SyncType.unsynch;
      wa.del = anyenum.DelType.del;
      sqlparam.push(wa.upTParam());
    }

    if (newAgdata.txjson.reminds && newAgdata.txjson.reminds.length > 0) {
      ev.evi = oriAgdata.evi;
      was =[...was,...this.sqlparamAddTxWa2(ev, anyenum.ObjectType.Event,  newAgdata.txjson)];
    }
    if (was && was.length > 0){
      waparams = this.sqlExce.getFastSaveSqlByParam(was);
    }

    //删除参与人
    let par = new ParTbl();
    par.obt = anyenum.ObjectType.Event;
    par.obi = parEvi;
    sqlparam.push(par.dTParam());

    //添加参与人
    let nwpar = new Array<any>();
    nwpar = this.sqlparamAddPar(parEvi , newAgdata.members);

    //更新相关ev表参与人数
    sq = ` update gtd_ev set pn = ? where evi = ? or rtevi = ? ;`;
    params = new Array<any>();
    params.push(newAgdata.members.length);
    params.push(parEvi);
    params.push(parEvi);
    sqlparam.push([sq,params]);

    /*//删除附件
    let fj = new FjTbl();
    fj.obt = anyenum.ObjectType.Event;
    fj.obi = oriAgdata.evi;
    sqlparam.push(fj.dTParam());
    //附件更新
    let nwfj = new Array<FjTbl>();
    nwfj = this.sqlparamAddFj(oriAgdata.evi, newAgdata.attachments);
    let fjparams = new Array<any>();
    if (nwfj && nwfj.length > 0){
      fjparams = this.sqlExce.getFastSaveSqlByParam(nwfj);
    }*/
    sqlparam =Object.assign(sqlparam, [...sqlparam,  ...nwpar,...waparams]);
  }

  /**
   * 如果当前修改单一对象是父事件，则为当前重复事件重建新的父事件，
   * 值为ev表重复记录里不为独立日不为删除的第一条做为父事件
   * @param {AgendaData} oriAgdata
   * @param {Array<Member>} members
   * @param {Array<any>} sqlparam
   * @param {DUflag} doflag
   * @returns {Promise<void>}
   */
  private async changedParentAgdForOther(oriAgdata : AgendaData,
                                      members : Array<Member>,
                                      sqlparam : Array<any>,
                                      outAgds : Array<AgendaData>) : Promise<boolean>{
    let ret : boolean = false;
    let sq : string ;
    let params : Array<any>;

    let nwEv = new EvTbl();

    let tos : string;//需要发送的参与人手机号
    tos = this.getMemberPhone(members);

    let upcondi :string ;
    let upAgds = new Array<AgendaData>();//保存修改的事件用
    let upAttaches = new Array<Attachment>();//保存修改的事件的附件用
    let upParent = {} as AgendaData;//新的父节点

    if ((!oriAgdata.rtevi || oriAgdata.rtevi =="" ) && oriAgdata.rfg == anyenum.RepeatFlag.Repeat){
      ret = true;
      //取得为修改的记录放入返回事件中
      upcondi = ` rtevi = ? `
      sq = ` select ev.*, ca.sd, ca.ed, ca.st, ca.et, ca.al, ca.ct
                        from (select *,
                        case when rfg = '2' then evi
                             when ifnull(rtevi, '') = '' then evi
                             else rtevi end forcaevi
                          from gtd_ev
                          where ${upcondi} ) ev
                        left join gtd_ca ca
                        on ca.evi = ev.forcaevi  order by ev.evd ; `
      params = new Array<any>();
      params.push(oriAgdata.evi);
      upAgds = await this.sqlExce.getExtLstByParam<AgendaData>(sq,params);

      //取得修改的事件的附件
      sq = `select * from gtd_fj where obt = ? and  obi in (select evi from gtd_ev
          where ${upcondi} ); `;
      params = new Array<any>();
      params.push(anyenum.ObjectType.Event);
      params.push(oriAgdata.evi);
      upAttaches = await this.sqlExce.getExtLstByParam<Attachment>(sq,params);

      if (upAgds.length > 0){
        //找到满足条件的首条记录
        upParent = upAgds.find((value, index,arr)=>{
          return value.rtevi == oriAgdata.evi && value.rfg == anyenum.RepeatFlag.Repeat && value.del != anyenum.DelType.del;

        });
        if (upParent){
          //更新首条为父事件
          upParent.rtevi = "";
          upParent.tb = anyenum.SyncType.unsynch;
          upParent.mi = UserConfig.account.id;
          upParent.pn = members.length;
          Object.assign(nwEv, upParent);
          sqlparam.push(nwEv.upTParam());

          //原子事件的父字段改为新的父事件
          sq = `update gtd_ev set rtevi = ?,mi= ?,tb = ? ,pn = ? where  ${upcondi}; `;
          params = new Array<any>();
          params.push(nwEv.evi);
          params.push(UserConfig.account.id);
          params.push(anyenum.SyncType.unsynch);
          params.push(members.length);
          params.push(oriAgdata.evi);
          sqlparam.push([sq,params]);

          //为新的父事件建立新的对应日程
          let nwca = new CaTbl();
          nwca = this.sqlparamAddCa(nwEv.evi ,oriAgdata);
          sqlparam.push(nwca.rpTParam());

          //复制原参与人到新的父事件
          let nwpar = new Array<any>();
          nwpar = this.sqlparamAddPar(nwEv.evi , members);



          //新父节点记录以外数据对象内容设置
          for (let j = 0 ,len = upAgds.length; j < len ;j ++){
            if (upAgds[j].rtevi != ""){
              upAgds[j].rtevi = upParent.evi;
            }
            upAgds[j].mi = UserConfig.account.id;
            upAgds[j].tb = anyenum.SyncType.unsynch;

            upAgds[j].tos = tos;//需要发送的参与人
            //参与人
            upAgds[j].members = members;
            upAgds[j].pn = members.length;
            //ca数据
            if (upAgds[j].rfg != anyenum.RepeatFlag.RepeatToOnly){
              //新的日程赋给非独立日的记录
              let tmpevi = upAgds[j].evi;
              Object.assign(upAgds[j] , nwca);
              upAgds[j].evi = tmpevi;
            }

            //附件
            if (upAttaches && upAttaches.length > 0){
              upAgds[j].attachments = upAttaches.filter((value, index, arr) => {
                return upAgds[j].evi == value.obi;
              });
            }
          }

          Object.assign(sqlparam , [...sqlparam, ...nwpar]);
        }

        Object.assign(outAgds , [...outAgds ,...upAgds]);
      }
    }

    return ret;
  }

  /**
   * 删除原事件中从当前开始所有事件
   * @param {string} masterEvi
   * @param {AgendaData} oriAgdata
   * @param {Array<any>} sqlparam
   * @param {Array<AgendaData>} outAgds
   * @returns {Promise<void>}
   */
  private async delFromsel(masterEvi : string ,
                           oriAgdata : AgendaData ,
                           sqlparam : Array<any>,
                           outAgds : Array<AgendaData>){
    let delAgds = new Array<AgendaData>();//保存删除的事件用
    let delAttachs = new Array<Attachment>();//保存删除的事件中相关附件
    let delcondi :string ;

    let tos : string;//需要发送的参与人手机号
    tos = this.getMemberPhone(oriAgdata.members);

    let sq : string ;
    let params : Array<any>;

    //标记为删除的记录放入返回事件中
    delcondi = ` evd >= ? and (evi = ? or rtevi =  ?) and del <> ? `;

    //取得所有删除的附件
    sq = `select * from gtd_fj where obt = ? and  obi in (select evi from gtd_ev
          where ${delcondi} ); `;
    params = new Array<any>();
    params.push(anyenum.ObjectType.Event);
    params.push(oriAgdata.evd);
    params.push(masterEvi);
    params.push(masterEvi);
    params.push(anyenum.DelType.del);
    delAttachs = await this.sqlExce.getExtLstByParam<Attachment>(sq,params);


    //取得所有要删除的事件
    sq = ` select ev.*, ca.sd, ca.ed, ca.st, ca.et, ca.al, ca.ct
                        from (select *,
                        case when rfg = '2' then evi
                             when ifnull(rtevi, '') = '' then evi
                             else rtevi end forcaevi
                          from gtd_ev
                          where ${delcondi} ) ev
                        left join gtd_ca ca
                        on ca.evi = ev.forcaevi ; `;
    params = new Array<any>();
    params.push(oriAgdata.evd);
    params.push(masterEvi);
    params.push(masterEvi);
    params.push(anyenum.DelType.del);
    delAgds = await this.sqlExce.getExtLstByParam<AgendaData>(sq,params);
    if (delAgds && delAgds != null && delAgds.length >0 ){
      for (let j = 0, len = delAgds.length; j < len ;j++){
        delAgds[j].del = anyenum.DelType.del;
        delAgds[j].mi = UserConfig.account.id;
        delAgds[j].tb = anyenum.SyncType.unsynch;

        delAgds[j].tos = tos;//需要发送的参与人
        delAgds[j].members = oriAgdata.members;//参与人

        //附件
        if (delAttachs && delAttachs.length > 0){
          delAgds[j].attachments = delAttachs.filter((value, index, arr) => {
            return delAgds[j].evi == value.obi;
          });
        }
      }
    }

    //删除原事件中从当前事件开始所有提醒 evd使用原事件evd
    sq = `update gtd_wa set tb = ? ,del = ?  where obt = ? and  obi in (select evi from gtd_ev
          where ${delcondi} ); `;
    params = new Array<any>();
    params.push(anyenum.SyncType.unsynch);
    params.push(anyenum.DelType.del);
    params.push(anyenum.ObjectType.Event);
    params.push(oriAgdata.evd);
    params.push(masterEvi);
    params.push(masterEvi);
    params.push(anyenum.DelType.del);
    sqlparam.push([sq,params]);


    //删除原事件中从当前开始所有事件 evd使用原事件evd
    sq = `update  gtd_ev set del = ? , mi =?,tb = ?  where ${delcondi} ;`;
    params = new Array<any>();
    params.push(anyenum.DelType.del);
    params.push(UserConfig.account.id);
    params.push(anyenum.SyncType.unsynch);
    params.push(oriAgdata.evd);
    params.push(masterEvi);
    params.push(masterEvi);
    params.push(anyenum.DelType.del);
    sqlparam.push([sq,params]);

    console.log("****  delFromsel 结果数组合并 start :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))
    Object.assign(outAgds,[...outAgds, ...delAgds]);
    console.log("****  delFromsel 结果数组合并 end :****" + moment().format("YYYY/MM/DD HH:mm:ss SSS"))

  }

  /**
   * 获取参与人手机号
   * @param {Array<Member>} members
   * @returns {Array<string>}
   */
  private getMemberPhone(members : Array<Member>): string{

    let ret : Array<string> = [];
    if (!members || members == null) {
      return "";
    }
    for (let j = 0,len = members.length; j < len ; j++){
      ret.push(members[j].rc);
    }
    return ret.join(",");
  }

  /**
   * 创建附件
   * @param {string} evi
   * @param {Array<FjTbl>} fjs
   * @returns {Array<any>}
   */
  private sqlparamAddFj(evi : string ,attachments : Array<Attachment>):Array<FjTbl>{
    let ret = new Array<FjTbl>();
    if (attachments && attachments.length > 0){
      for (let j = 0 ,len = attachments.length;j < len ; j++){
        let fj = new FjTbl();
        Object.assign(fj, attachments[j]);
        fj.fji = this.util.getUuid();
        fj.obt = anyenum.ObjectType.Event;
        fj.obi = evi;
        ret.push(fj);
      }
    }
    return ret;
  }

  /**
   * 创建参与人
   * @param {string} evi
   * @param {Array<Member>} pars
   * @returns {Array<any>}
   */
  private sqlparamAddPar(evi : string ,pars : Array<Member>):Array<any>{
    let ret = new Array<any>();
    if (pars && pars.length > 0){
      for (let j = 0 ,len = pars.length;j < len ; j++){
        let par = new ParTbl();
        par.pari = this.util.getUuid();
        par.pwi = pars[j].pwi;
        par.ui = pars[j].ui;
        par.obt = anyenum.ObjectType.Event;
        par.obi = evi;
        par.sa = pars[j].sa;
        par.sdt = pars[j].sdt;
        par.tb = anyenum.SyncType.unsynch;
        par.del = anyenum.DelType.undel;
        ret.push(par.rpTParam());
      }
    }
    return ret;
  }

  /**
   * 初始化页面参数
   * @param {AgendaData} agdata
   */
  private initAgdParam(agdata : AgendaData){

    agdata.members = !agdata.members ? new Array<Member>() : agdata.members;
    agdata.attachments = !agdata.attachments ? new Array<Attachment>() : agdata.attachments;

    agdata.ui = UserConfig.account.id;
    agdata.mi = (!agdata.mi || agdata.mi =="")? UserConfig.account.id : agdata.mi;
    agdata.rtevi = !agdata.rtevi ? "" : agdata.rtevi ;
    agdata.ji = !agdata.ji ?  "" : agdata.ji;
    agdata.bz = !agdata.bz ? "" : agdata.bz ;
    agdata.type = !agdata.type ? anyenum.EventType.Agenda : agdata.type ;

    let txjson = new TxJson();

    agdata.txjson = (agdata.txjson && agdata.txjson !=null) ? agdata.txjson : txjson;
    agdata.tx = !agdata.tx ? JSON.stringify(agdata.txjson) : agdata.tx ;
    agdata.txs = !agdata.txs ? "" : agdata.txs ;

    let rtjon = new RtJson();
    rtjon.cycletype = anyenum.CycleType.close;
    rtjon.over.value = "";
    rtjon.over.type = anyenum.OverType.fornever;
    rtjon.cyclenum = 1;
    rtjon.openway = new Array<number>();

    agdata.rtjson = (agdata.rtjson && agdata.rtjson !=null) ? agdata.rtjson : rtjon;
    agdata.rt = !agdata.rt ? JSON.stringify(agdata.rtjson) : agdata.rt ;
    agdata.rts = !agdata.rts ? "" : agdata.rts ;


    agdata.fj = !agdata.fj ? "" : agdata.fj ;
    agdata.pn = !agdata.pn ? 0 : agdata.pn ;
    agdata.md = !agdata.md ? anyenum.ModiPower.enable : agdata.md ;
    agdata.iv = !agdata.iv ? anyenum.InvitePowr.enable : agdata.iv ;
    agdata.sr = !agdata.sr ? "" : agdata.sr ;
    agdata.gs = !agdata.gs ? anyenum.GsType.self : agdata.gs ;

    agdata.wc = !agdata.wc ? anyenum.EventFinishStatus.NonFinish : agdata.wc ;
    agdata.todolist = !agdata.todolist ? anyenum.ToDoListStatus.Off : agdata.todolist ;
    agdata.invitestatus = !agdata.invitestatus ? anyenum.InviteState.None : agdata.invitestatus ;

    agdata.tb = !agdata.tb ? anyenum.SyncType.unsynch : agdata.tb ;
    agdata.del = !agdata.del ? anyenum.DelType.undel : agdata.del ;
    agdata.rfg = !agdata.rfg ? anyenum.RepeatFlag.NonRepeat : agdata.rfg ;

    agdata.al = !agdata.al ? anyenum.IsWholeday.StartSet :agdata.al;



    if (agdata.al == anyenum.IsWholeday.StartSet){
      agdata.ct = !agdata.ct ? 60 :agdata.ct;

      agdata.sd = agdata.sd || agdata.evd || moment().format("YYYY/MM/DD");
      agdata.st = !agdata.st ? this.EVT_ST : agdata.st;

      agdata.ed = agdata.ed || moment(agdata.sd + " " + agdata.st).
      add(agdata.ct, 'm').format("YYYY/MM/DD");
      agdata.et = !agdata.et ? moment(agdata.sd + " " + agdata.st).
      add(agdata.ct, 'm').format("HH:mm") : agdata.et;
    }else{
      agdata.ct = !agdata.ct ? 0 :agdata.ct;
      agdata.ed = agdata.ed || moment().
      add(7, 'd').format("YYYY/MM/DD");
      agdata.et = !agdata.et ? moment().
      add(7, 'd').format("HH:mm") : agdata.et;

      agdata.sd = agdata.sd || agdata.evd || agdata.ed;
      agdata.st = !agdata.st ? agdata.et : agdata.st;
    }

  }

  private sqlparamAddEv2(agdata: AgendaData): RetParamEv {

    let ret = new RetParamEv();
    let outAgds = new Array<AgendaData>();
    let evs = new Array<EvTbl>();
    let was = new Array<WaTbl>();
    let fjs = new Array<FjTbl>();

    //字段evt 设定

    agdata.evt = agdata.st;


    let rtjson: RtJson = new RtJson();
    Object.assign(rtjson, agdata.rtjson);
    agdata.rt = JSON.stringify(agdata.rtjson);
    agdata.rts = rtjson.text();

    if (rtjson.cycletype == anyenum.CycleType.close){

      agdata.rfg = anyenum.RepeatFlag.NonRepeat;
    }else{

      agdata.rfg = anyenum.RepeatFlag.Repeat;
    }

    let txjson : TxJson  = agdata.txjson;
    agdata.tx = JSON.stringify(agdata.txjson);
    agdata.txs = agdata.txjson.text();

    //获取重复日期
    rtjson.each(agdata.sd, (day) => {

      let ev = new EvTbl();

      Object.assign(ev, agdata);

      ev.evi = this.util.getUuid();

      // 非重复日程及重复日程的第一条的rtevi（父日程evi）字段设为空。遵循父子关系，
      // 父记录的父节点字段rtevi设为空，子记录的父节点字段rtevi设为父记录的evi
      if (evs.length < 1) {
        ret.rtevi = ev.evi;
        agdata.evi = ev.evi;
        ev.rtevi = "";
      }else{
        ev.rtevi = ret.rtevi;
      }

      ev.evd = day;
      ev.type = anyenum.EventType.Agenda;
      ev.tb = anyenum.SyncType.unsynch;
      ev.del = anyenum.DelType.undel;

      evs.push(ev);

      if (ev.todolist == anyenum.ToDoListStatus.On ) {
        //如果在todolist中，则加系统提醒
        was.push(this.sqlparamAddSysTx2(ev,anyenum.ObjectType.Event));
      }

      if (txjson.reminds && txjson.reminds.length > 0) {
        was = [...was,...this.sqlparamAddTxWa2(ev,anyenum.ObjectType.Event,txjson)];
      }

      /*if (agdata.attachments && agdata.attachments.length > 0){
        fjs = [...fjs,...this.sqlparamAddFj(ev.evi,agdata.attachments)];
      }附件由附件页面保存*/

      //新增数据需要返回出去
      let outAgd = {} as AgendaData;
      Object.assign(outAgd,ev);
      outAgds.push(outAgd);
    } ,true);

    let evparams = new  Array<any>();
    if (evs && evs.length > 0) {
      evparams = this.sqlExce.getFastSaveSqlByParam(evs);
    }
    let waparams = new  Array<any>();
    if (was && was.length > 0) {
      waparams = this.sqlExce.getFastSaveSqlByParam(was);
    }
    /*let fjparams = new  Array<any>();
    if (fjs && fjs.length > 0) {
      fjparams = this.sqlExce.getFastSaveSqlByParam(fjs);
    }*/
    ret.sqlparam = [...evparams,...waparams,...ret.sqlparam];

    ret.outAgdatas = outAgds;
    return ret;
  }

  /**
   * 日程新增sql list
   * @param {string} rtevi
   * @param {AgendaData} agdata
   * @returns {Array<any>}
   */
  private sqlparamAddCa(rtevi : string,agdata : AgendaData): CaTbl {

    if (agdata.al == anyenum.IsWholeday.EndSet){
      agdata.sd = agdata.ed;
      agdata.st = agdata.et;
      agdata.ct = 0;
    }

    let ca = new CaTbl();
    ca.evi = rtevi;
    ca.sd = agdata.sd;
    ca.ed = agdata.ed;
    ca.ct = agdata.ct;
    ca.al = agdata.al;
    ca.st = agdata.st;
    ca.et = agdata.et;

    return ca;
  }

  /**
	 * 删除任务
   *
	 * @author leon_xi@163.com
	 */
  async removeTask(task: TaskData): Promise<TaskData> {
    this.assertEmpty(task);     // 入参不能为空
    this.assertEmpty(task.evi); // 任务ID不能为空

    task.del = DelType.del;
    task.tb = SyncType.unsynch;

    let sqls: Array<string> = new Array<string>();

    let evdb: EvTbl = new EvTbl();
    Object.assign(evdb, task);

    sqls.push(evdb.upTParam());

    let tdb: TTbl = new TTbl();
    Object.assign(tdb, task);

    sqls.push(tdb.upTParam());

    await this.sqlExce.batExecSqlByParam(sqls);
    this.emitService.emit("mwxing.calendar.activities.changed", task);
    this.syncTask(task);

    return task;
  }

	/**
	 * 创建更新任务
   *
   * 重复任务不直接创建多个任务记录
   * 前面的任务完成后, 新增完成日程后续的新任务
   *
	 * @author ying<343253410@qq.com>
	 */
  async saveTask(task: TaskData): Promise <TaskData> {
		this.assertEmpty(task); // 对象不能为空
		this.assertEmpty(task.evn); // 事件主题不能为空
		let evi: string ="";
		if(task.evi) {
			evi = task.evi;
			//更新任务事件
			let evdb: EvTbl = new EvTbl();
			task.mi = UserConfig.account.id; //更新者
			Object.assign(evdb, task);
		  await this.sqlExce.updateByParam(evdb);
		  let ttdb: TTbl = new TTbl();
		  Object.assign(ttdb, task);
			await this.sqlExce.updateByParam(ttdb);
		} else {
			//创建事件
			task.evi = this.util.getUuid();
			evi = task.evi;
			task.ui = UserConfig.account.id;
			task.type = anyenum.EventType.Task;
			task.evd = task.evd || moment().format('YYYY/MM/DD');
			task.gs = anyenum.GsType.self;
			task.tb = anyenum.SyncType.unsynch;
			task.del = anyenum.DelType.undel;
			task.evt = task.evt || "23:59";
		  task.cs = task.cs || anyenum.IsSuccess.wait;
			task.isrt = task.isrt || anyenum.IsCreate.isNo;

			let txjson = new TxJson();
    	task.txjson = task.txjson ||  txjson;
      task.txs = task.txs || "";
	    let rtjon = new RtJson();
	    rtjon.cycletype = anyenum.CycleType.close;
	    rtjon.over.value = "";
	    rtjon.over.type = anyenum.OverType.fornever;
	    rtjon.cyclenum = 1;
	    rtjon.openway = new Array<number>();
	    task.rtjson = task.rtjson || rtjon;

			let sqlparam = new Array<any>();
			let retParamTaskData = new RetParamTaskData();
			retParamTaskData = this.sqlparamAddTaskData(task);
			sqlparam = [...retParamTaskData.sqlparam];
      await this.sqlExce.batExecSqlByParam(sqlparam);
		}

    this.emitService.emit("mwxing.calendar.activities.changed", task);
    this.syncTask(task);

		return task;
  }

	private sqlparamAddTaskData(taskData: TaskData): RetParamTaskData {

    let ret = new RetParamTaskData();
    let outTasks = new Array<TaskData>();

    //字段evt 设定
   	taskData.evt = taskData.evt||"23:59";

    let rtjson: RtJson = new RtJson();
    Object.assign(rtjson, taskData.rtjson);
    taskData.rt = JSON.stringify(taskData.rtjson);

    if (rtjson.cycletype == anyenum.CycleType.close){

      taskData.rfg = anyenum.RepeatFlag.NonRepeat;
    }else{

      taskData.rfg = anyenum.RepeatFlag.Repeat;
    }

    let txjson : TxJson  =  taskData.txjson;
    taskData.tx = JSON.stringify(taskData.txjson);

//		let days: Array<string> = new Array<string>();
		//获取重复日期
   rtjson.each(taskData.evd, (day) => {
   	  let ev = new EvTbl();
	    Object.assign(ev, taskData);
	    ev.evi = this.util.getUuid();
	    // 非重复日程及重复日程的第一条的rtevi（父日程evi）字段设为空。遵循父子关系，
	    // 父记录的父节点字段rtevi设为空，子记录的父节点字段rtevi设为父记录的evi
	    if (ret.sqlparam.length < 1) {
	      ret.rtevi = ev.evi;
	      taskData.evi = ev.evi;
	      ev.rtevi = "";
	    }else{
	      ev.rtevi = ret.rtevi;
	    }
	    ev.evd = day;
	    ev.type = anyenum.EventType.Task;
	    ev.tb = anyenum.SyncType.unsynch;
	    ev.del = anyenum.DelType.undel;
	    ret.sqlparam.push(ev.rpTParam());
	    //添加提醒的SQL
      if (txjson.reminds && txjson.reminds.length > 0) {
		  	ret.sqlparam = [...ret.sqlparam ,...this.sqlparamAddTxWa(ev,anyenum.ObjectType.Event,txjson)];
	  	}
	    //创建任务SQL
	     ret.sqlparam.push(this.sqlparamAddTaskTt(ev,taskData.cs, taskData.isrt))
	    //新增数据需要返回出去
	    let task2 = {} as TaskData;
	    Object.assign(task2,ev);
	    outTasks.push(task2);
    });
		// days = this.getOutDays(rtjson,taskData.evt);
		// for(let day of days) {
    //
   	//   let ev = new EvTbl();
	  //   Object.assign(ev, taskData);
	  //   ev.evi = this.util.getUuid();
	  //   // 非重复日程及重复日程的第一条的rtevi（父日程evi）字段设为空。遵循父子关系，
	  //   // 父记录的父节点字段rtevi设为空，子记录的父节点字段rtevi设为父记录的evi
	  //   if (ret.sqlparam.length < 1) {
	  //     ret.rtevi = ev.evi;
	  //     taskData.evi = ev.evi;
	  //     ev.rtevi = "";
	  //   }else{
	  //     ev.rtevi = ret.rtevi;
	  //   }
	  //   ev.evd = day;
	  //   ev.type = anyenum.EventType.Task;
	  //   ev.tb = anyenum.SyncType.unsynch;
	  //   ev.del = anyenum.DelType.undel;
	  //   ret.sqlparam.push(ev.rpTParam());
	  //   //添加提醒的SQL
    //   if (txjson.reminds && txjson.reminds.length > 0) {
		//   	ret.sqlparam = [...ret.sqlparam ,...this.sqlparamAddTxWa(ev,anyenum.ObjectType.Event,txjson)];
	  // 	}
	  //   //创建任务SQL
	  //    ret.sqlparam.push(this.sqlparamAddTaskTt(ev,taskData.cs, taskData.isrt))
	  //   //新增数据需要返回出去
	  //   let task2 = {} as TaskData;
	  //   Object.assign(task2,ev);
	  //   outTasks.push(task2);
		// }
  	ret.outTasks = outTasks;
  	return ret;
  }

  /**
   * 获取提醒表sql
   * @param {EvTbl} ev
   * @param {string} obtType
   * @param {TxJson} txjson
   * @returns {Array<any>}
   */
  private sqlparamAddTxWa2(ev: EvTbl,obtType: string, txjson :TxJson): Array<WaTbl> {
    let ret = new Array<WaTbl>();

    if (txjson.reminds && txjson.reminds.length > 0) {
      for ( let j = 0, len = txjson.reminds.length ;j < len ; j++) {
        let wa = new WaTbl();//提醒表
        let remind : number;

        wa.obt = obtType;
        wa.obi = ev.evi;
        remind = txjson.reminds[j];
        wa.st = ev.evn;
        wa.tb = anyenum.SyncType.unsynch;
        wa.del = anyenum.DelType.undel;

        let time = remind;
        let date;
        date = moment(ev.evd + " " + ev.evt).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

        //使用ev表zhukey与提醒时间的组合，便于服务器更新及本地更新
        wa.wai = ev.evi + moment(date).format("YYYYMMDDHHmm") ;
        wa.wd = moment(date).format("YYYY/MM/DD");
        wa.wt = moment(date).format("HH:mm");
        ret.push(wa);
        //console.log('-------- 插入提醒表 --------');
      }
    }
    return ret;
  }
  /**
   * 获取提醒表sql
   * @param {EvTbl} ev
   * @param {string} obtType
   * @returns {WaTbl}
   */
  private sqlparamAddSysTx2(ev: EvTbl,obtType: string): WaTbl {
    let wa = new WaTbl();//提醒表

    wa.obt = obtType;
    wa.obi = ev.evi;

    wa.st = ev.evn;
    wa.tb = anyenum.SyncType.unsynch;
    wa.del = anyenum.DelType.undel;

    let date;
    date = moment(ev.evd + " " + ev.evt);

    if (date.isBefore(moment())){
      let loop = true;
      while(loop){
        date = moment(date).add(4,'hours');
        if (date.diff(moment(),'hours',true) > 1){
          loop = false;
        }
      }
    }

    //每个ev对应的系统提醒主key使用evi
    wa.wai = ev.evi ;
    wa.wd = date.format("YYYY/MM/DD");
    wa.wt = date.format("HH:mm");

    //console.log('-------- 插入提醒表 --------');

    return wa;
  }
  /**
   * 获取提醒表sql
   * @param {EvTbl} ev
   * @param {string} obtType
   * @param {TxJson} txjson
   * @param {string} al
   * @param {string} st
   * @returns {Array<any>}
   */
  private sqlparamAddTxWa(ev: EvTbl,obtType: string, txjson :TxJson, al: string = "" ,st:string=""): Array<any> {
    let ret = new Array<any>();
    if (txjson.reminds && txjson.reminds.length > 0) {
      for ( let j = 0, len = txjson.reminds.length ;j < len ; j++) {
        let wa = new WaTbl();//提醒表
        let remind : number;
        wa.wai = this.util.getUuid();
        wa.obt = obtType;
        wa.obi = ev.evi;
        remind = txjson.reminds[j];
        wa.st = ev.evn;
        let time = remind;
        let date;
        if (al == anyenum.IsWholeday.StartSet) {
          date = moment(ev.evd + " " + st).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

        } else {
          date = moment(ev.evd + " " + this.EVT_ST).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

        }
        wa.wd = moment(date).format("YYYY/MM/DD");
        wa.wt = moment(date).format("HH:mm");
        ret.push(wa.rpTParam());
        //console.log('-------- 插入提醒表 --------');
      }
    }
    return ret;
  }


  	/**
   *  获取任务SQL
   * @param {EvTbl}
   * @param {ev: EvTbl,st:string ,sd:string,txjson :TxJson }
   * @returns {ETbl}
   */
  private sqlparamAddTaskTt(ev: EvTbl,cs: string, isrt : string ): any {
    //创建任务
		let ttdb: TTbl = new TTbl();
		ttdb.evi = ev.evi;
		ttdb.cs = cs || anyenum.IsSuccess.wait;
		ttdb.isrt = isrt || anyenum.IsCreate.isNo;
		ttdb.cd = moment().format('YYYY/MM/DD');
    return ttdb.rpTParam();
  }

	/**
	 * 根据事件ID获取任务
	  @author ying<343253410@qq.com>
	 */
	async getTask(evi: string): Promise<TaskData> {
			this.assertEmpty(evi); // id不能为空
			let task: TaskData = {} as TaskData;
			let params= Array<any>();
			let sqlparam: string =`select ev.*,td.cs,td.isrt,td.cd,td.fd from gtd_ev  ev left join gtd_t  td on ev.evi = td.evi where ev.evi ='${evi}' and  ev.del ='undel'`;
			console.info("执行的SQL"+sqlparam);
			task = await this.sqlExce.getExtOneByParam<TaskData>(sqlparam,params);
  		return task;
	}

  /**
	 * 创建更新小任务
	 * @author ying<343253410@qq.com>
	 */
  async saveMiniTask(minitask: MiniTaskData): Promise <MiniTaskData> {
  	this.assertEmpty(minitask); // 对象不能为空
  	this.assertEmpty(minitask.evn);
  	if (minitask.evi) {
			let evdb: EvTbl = new EvTbl();
			Object.assign(evdb, minitask);
			await this.sqlExce.updateByParam(evdb);
		} else {
			minitask.evi = this.util.getUuid();
			minitask.ui= UserConfig.account.id;
			minitask.type = anyenum.EventType.MiniTask;
			minitask.evd = minitask.evd || moment().format('YYYY/MM/DD');
			minitask.gs = anyenum.GsType.self;
			minitask.tb = anyenum.SyncType.unsynch;
			minitask.del = anyenum.DelType.undel;
			minitask.evt = minitask.evt || "23:59";

			let txjson = new TxJson();
    	minitask.txjson = minitask.txjson ||  txjson;
      minitask.txs = minitask.txs || "";
	    let rtjon = new RtJson();
	    rtjon.cycletype = anyenum.CycleType.close;
	    rtjon.over.value = "";
	    rtjon.over.type = anyenum.OverType.fornever;
	    rtjon.cyclenum = 1;
	    rtjon.openway = new Array<number>();
	    minitask.rtjson = minitask.rtjson || rtjon;

			let sqlparam = new Array<any>();
			let retParamMiniTaskData = new RetParamMiniTaskData();
			retParamMiniTaskData = this.sqlparamAddMiniTaskData(minitask);
			sqlparam = [...retParamMiniTaskData.sqlparam];
      await this.sqlExce.batExecSqlByParam(sqlparam);
		}

    this.emitService.emit("mwxing.calendar.activities.changed", minitask);

		return minitask;
  }

	private sqlparamAddMiniTaskData(minitask: MiniTaskData): RetParamMiniTaskData {

    let ret = new RetParamMiniTaskData();
    let outTasks = new Array<MiniTaskData>();

    //字段evt 设定
   	minitask.evt = minitask.evt||"23:59";

    let rtjson: RtJson = new RtJson();
    Object.assign(rtjson, minitask.rtjson);
    minitask.rt = JSON.stringify(minitask.rtjson);

    if (rtjson.cycletype == anyenum.CycleType.close){

      minitask.rfg = anyenum.RepeatFlag.NonRepeat;
    }else{

      minitask.rfg = anyenum.RepeatFlag.Repeat;
    }

    let txjson : TxJson  =  minitask.txjson;
    minitask.tx = JSON.stringify(minitask.txjson);

		// let days: Array<string> = new Array<string>();
		//获取重复日期
    rtjson.each(minitask.evd, (day) => {
      let ev = new EvTbl();
      Object.assign(ev, minitask);
      ev.evi = this.util.getUuid();
      // 非重复日程及重复日程的第一条的rtevi（父日程evi）字段设为空。遵循父子关系，
      // 父记录的父节点字段rtevi设为空，子记录的父节点字段rtevi设为父记录的evi
      if (ret.sqlparam.length < 1) {
        ret.rtevi = ev.evi;
        minitask.evi = ev.evi;
        ev.rtevi = "";
      }else{
        ev.rtevi = ret.rtevi;
      }
      ev.evd = day;
      ev.type = anyenum.EventType.MiniTask;
      ev.tb = anyenum.SyncType.unsynch;
      ev.del = anyenum.DelType.undel;
      ret.sqlparam.push(ev.rpTParam());
      //添加提醒的SQL
      if (txjson.reminds && txjson.reminds.length > 0) {
        ret.sqlparam = [...ret.sqlparam ,...this.sqlparamAddTxWa(ev,anyenum.ObjectType.Event,txjson)];
      }
      //新增数据需要返回出去
      let task2 = {} as MiniTaskData;
      Object.assign(task2,ev);
      outTasks.push(task2);
    });

  	ret.outTasks = outTasks;

  	return ret;
  }


	/**
	 *  获取小任务
	 * @author ying<343253410@qq.com>
	 */
	async getMiniTask(evi: string): Promise<MiniTaskData> {
			this.assertEmpty(evi); // id不能为空
			let params= Array<any>();
			let sqlparam: string =`select * from gtd_ev where evi = '${evi}' and  del ='undel'`;
			let evdbnew = await this.sqlExce.getExtOneByParam<TaskData>(sqlparam,params);
  		if (evdbnew && evdbnew.evi) {
				let ev: MiniTaskData = {} as MiniTaskData;
				Object.assign(ev, evdbnew);
				return ev;
			} else {
				return null;
			}
	}

  updateEventPlan() {}
  updateEventRemind() {}
  updateEventRepeat() {}
  removeEvent() {}

  /**
	 * 完成任务
	 * @author ying<343253410@qq.com>
	 */
  async finishTask(task: TaskData): Promise<TaskData> {
    this.assertEmpty(task);        // 入参不能为空
  	this.assertEmpty(task.evi);    // 事件ID不能为空

    task.cs = anyenum.IsSuccess.success;
    task.evd = moment().format('YYYY/MM/DD');
    task.evt = moment().format('HH:mm');
    task.fd = moment().format('YYYY/MM/DD');

    let sqls: Array<any> = new Array<any>();

    let evdb: EvTbl = new EvTbl();
    Object.assign(evdb, task);

    sqls.push(evdb.rpTParam());

    let tdb: TTbl = new TTbl();
    Object.assign(tdb, task);

    sqls.push(tdb.rpTParam());

		await this.sqlExce.batExecSqlByParam(sqls);

    this.emitService.emit("mwxing.calendar.activities.changed", task);

		return task;
  }

  /**
   * 当是自动创建的任务的情况下,进行下一步操作
   * @author ying<343253410@qq.com>
   */
  async finishTaskNext(evi: string) :Promise <TaskData> {
  	this.assertEmpty(evi);
  	let task: TaskData = {} as TaskData;
  	task = await this.getTask(evi);
  	let task2: TaskData = null;
		if (task.isrt == anyenum.IsCreate.isYes) {
			//创建新的任务事件
			let task3:TaskData = {} as TaskData;
			Object.assign(task3, task);
			if(!task3.rtevi) {
					task3.rtevi = evi;
			}
			task3.evi = "";
			task3.evd = moment().format('YYYY/MM/DD');
			task3.cs = anyenum.IsSuccess.wait;
			task3.isrt = anyenum.IsCreate.isYes;
			task2 = await this.saveTask(task3);
		}
		return task2;
  }

  async sendAttachment(attachments: Array<Attachment>) {
    this.assertEmpty(attachments);  // 入参不能为空

    await this.syncAttachments(attachments);

    return;
  }

  async syncAttachments(attachments: Array<Attachment> = new Array<Attachment>(), callback: (updated: any) => void = null) {
    this.assertEmpty(attachments);    // 入参不能为空

    let members = new Array<Member>();

    if (attachments.length <= 0) {
      let sql: string = `select * from gtd_fj where tb <> ?1 and ui = ?2`;

      attachments = await this.sqlExce.getExtLstByParam<Attachment>(sql, [SyncType.synch, UserConfig.account.id]) || attachments;

      let sqlmember: string = `select par.*,
                        b.ran,
                        b.ranpy,
                        '' hiu,
                        b.rn,
                        b.rnpy,
                        b.rc,
                        b.rel,
                      b.src
                      from
                      (select * from gtd_par where obi in
                      (select obi from gtd_fj where ui = ?2 and (tb <> ?1 or tb is null))) par
                      left join gtd_b b
                      on b.pwi = par.pwi`;
      members =  await this.sqlExce.getExtLstByParam<Member>(sqlmember,
        [SyncType.synch, UserConfig.account.id]) || members;
    }

    let maxdata: number = 5;

    if (attachments.length > 0) {
      let push: PushInData = new PushInData();

      let index: number = 0;
      for (let attachment of attachments) {
        let sync: SyncData = new SyncData();

        // 处理历史创建的附件数据 2019/10/31
        if (!attachment.ui) {
          attachment.ui = UserConfig.account.id;
        }

        sync.src = attachment.ui;
        sync.id = attachment.fji;
        sync.type = "Attachment";
        sync.title = "[" + UserConfig.account.name + "] 补充 " + attachment.fjn;
        sync.datetime = moment.unix(attachment.wtt).format("YYYY/MM/DD HH:mm");

        sync.main = true;
        sync.security = SyncDataSecurity.None;
        sync.todostate = CompleteState.None;

        // 设置删除状态
        if (attachment.del == DelType.del) {
          sync.status = SyncDataStatus.Deleted;
        } else {
          sync.status = SyncDataStatus.UnDeleted;
        }

        sync.invitestate = InviteState.None;

        let tos: string = "";

        if (attachment.members && attachment.members.length > 0) {
          tos = this.getMemberPhone(attachment.members);
        } else if (members.length > 0) {
          let membersTos: Array<Member> = members.filter((value, index, arr) => {
            return attachment.obi == value.obi;
          });
          tos = this.getMemberPhone(membersTos);
        }

        sync.to = (!tos || tos == "" || tos == null) ? [] : tos.split(",") ;

        attachment.fpjson = generateCacheFilePathJson(attachment.fpjson, attachment.fj);

        // 上传文件到服务器
        if (attachment.fpjson && !attachment.fpjson.remote && attachment.ext && attachment.ext != "") {
          // 仅限手机设备上上传文件附件
          if (this.util.hasCordova()) {
            let upload: UploadInData = new UploadInData();
            upload.filepath = attachment.fpjson.getLocalFilePath(this.file.dataDirectory);

            let data = await this.dataRestful.upload(upload);
            console.log("upload <=> " + JSON.stringify(data));
            if (data && data.data) {
              attachment.fpjson.remote = String(data.data);
              attachment.fj = JSON.stringify(attachment.fpjson);

              if (callback) callback(attachment);
            }
          }
        }

        sync.payload = attachment;

        push.d.push(sync);

        index++;

        if (index % maxdata == 0) {
          await this.dataRestful.push(push);
          push = new PushInData();
        }
      }

      if (index % maxdata != 0) {
        await this.dataRestful.push(push);
      }
    }

    return ;
  }

  async acceptSyncAttachments(ids: Array<string>) {
    let sqls: Array<any> = new Array<any>();

    let sql: string = `update gtd_fj set tb = ? where fji in ('` + ids.join(', ') + `')`;

    sqls.push([sql, [SyncType.synch]]);

    await this.sqlExce.batExecSqlByParam(sqls);

    // 同步完成后刷新缓存
  }

  async receivedAttachment(fji: any) {
    this.assertEmpty(fji);   // 入参不能为空

    let pull: PullInData = new PullInData();

    if (fji instanceof Array) {
      pull.type = "Attachment";
      pull.d.splice(0, 0, ...fji);
    } else {
      pull.type = "Attachment";
      pull.d.push(fji);
    }

    // 发送下载附件请求
    await this.dataRestful.pull(pull);

    return;
  }

  async receivedAttachmentData(attachments: Array<Attachment>, status: SyncDataStatus): Promise<Array<Attachment>> {
    this.assertEmpty(attachments);    // 入参不能为空
    this.assertEmpty(status);         // 入参不能为空

    let sqlparam = new Array<any>();

    let saved: Array<Attachment> = new Array<Attachment>();
    let nwfj = new Array<FjTbl>();

    for (let attachment of attachments) {
      let single = {} as Attachment;
      Object.assign(single, attachment);

      // 删除参与人时，通过这个字段传递删除数据
      if (status == SyncDataStatus.Deleted) {
        single.del = DelType.del;
      } else {
        // 删除字段不共享, 如果不存在需要设置默认值
        if (!single.del) single.del = DelType.undel;
      }

      single.tb = SyncType.synch;

      let fj = new FjTbl();
      Object.assign(fj, single);
      sqlparam.push(fj.rpTParam());

      attachment.fpjson = generateCacheFilePathJson(attachment.fpjson, attachment.fj);

      // 下载文件到本地 默认不下载 用户手动下载
      // if (attachment.fpjson && attachment.fpjson.remote && attachment.ext && attachment.ext != "") {
      //   // 仅限手机设备上下载
      //   if (this.util.hasCordova()) {
      //     let download: DownloadInData = new DownloadInData();
      //
      //     let remote = Number(attachment.fpjson.remote);
      //
      //     if (!isNaN(remote)) {
      //       download.id = attachment.fpjson.remote;
      //       download.filepath = attachment.fpjson.getLocalFilePath(this.file.dataDirectory);
      //
      //       let data = await this.dataRestful.download(download);
      //       console.log("download <=> " + JSON.stringify(data));
      //     }
      //   }
      // }

      saved.push(single);
    }

    await this.sqlExce.batExecSqlByParam(sqlparam);

    return saved;
  }

  /**
	 * 发送日程进行共享
   *
	 * @author leon_xi@163.com
	 */
  async sendAgenda(agendas: Array<AgendaData>) {
    this.assertEmpty(agendas);  // 入参不能为空
    await this.syncAgendas(agendas);
  	return ;
  }

  /**
   * 同步全部的未同步的日程/指定日程到服务器
   *
   * @author leon_xi@163.com
   */
  async syncAgendas(agendas: Array<AgendaData> = new Array<AgendaData>()) {
    this.assertEmpty(agendas);  // 入参不能为空

    let members = new Array<Member>();
    let attachments = new Array<Attachment>();

    if (agendas.length <= 0) {
      let sql: string = `select ev.*, ca.sd, ca.ed, ca.st, ca.et, ca.al, ca.ct
                        from (select *,
                        case when rfg = '2' then evi
                             when ifnull(rtevi, '') = '' then evi
                             else rtevi end forceevi
                          from gtd_ev
                          where ui <> '' and ui is not null and type = ?1 and tb = ?2) ev
                        left join gtd_ca ca
                        on ca.evi = ev.forceevi`;
  		agendas = await this.sqlExce.getExtLstByParam<AgendaData>(sql, [anyenum.EventType.Agenda, SyncType.unsynch]) || agendas;

      // 增加附件同步
      let sqlattachments: string = `select distinct fj.* from (
                                    select
                                          case when rfg = '2' then evi
                                             when ifnull(rtevi, '') = '' then evi
                                             else rtevi end forceevi
                                          from gtd_ev
                                          where ui <> '' and ui is not null and type = ?1 and tb = ?2
                                  ) ev
                                  inner join gtd_fj fj
                                  on ev.forceevi = fj.obi and fj.obt = ?3`;
      attachments =  await this.sqlExce.getExtLstByParam<Attachment>(sqlattachments,
        [anyenum.EventType.Agenda, SyncType.unsynch, anyenum.ObjectType.Event]) || attachments;

  		let sqlmember: string = ` select distinct par.*  ,
  		                              b.ran,
                                   b.ranpy,
                                   '' hiu,
                                   b.rn,
                                   b.rnpy,
                                   b.rc,
                                   b.rel,
                                   b.src
  		                        from (select
                                    case when rfg = '2' then evi
                                       when ifnull(rtevi, '') = '' then evi
                                       else rtevi end forceevi
                                    from gtd_ev
                                    where ui <> '' and ui is not null and type = ?1 and tb = ?2) ev
                              inner join gtd_par par
                              on ev.forceevi = par.obi and par.obt = ?3
                              inner join gtd_b b
                              on par.pwi = b.pwi `;
      members =  await this.sqlExce.getExtLstByParam<Member>(sqlmember,
        [anyenum.EventType.Agenda, SyncType.unsynch, anyenum.ObjectType.Event]) || members;

    } else {
      let evis: Array<string> = agendas.reduce((target, ele) => {
        target.push(ele.evi);
        return target;
      }, new Array<string>());

      // 增加附件同步
      let sqlattachments: string = `select *
                                    from gtd_fj
                                    where obi in ('` + evis.join(', ') + `') and obt = ?1`;
      attachments =  await this.sqlExce.getExtLstByParam<Attachment>(sqlattachments,
        [anyenum.ObjectType.Event]) || attachments;
    }

    let maxdata: number = 5;

    if (agendas.length > 0) {
      let push: PushInData = new PushInData();

      let index: number = 0;
      for (let agenda of agendas) {
        let currentAttachments: Array<Attachment> = attachments.filter((ele) => {
          return ele.obi == agenda.evi;
        }) || new Array<Attachment>();

        let sync: SyncData = new SyncData();

        sync.fields.unshared.push("del");             // 删除状态为个人数据不共享给他人
        sync.fields.unshared.push("bz");              // 备注为个人数据不共享给他人
        sync.fields.unshared.push("ji");              // 计划为个人数据不共享给他人
        sync.fields.unshared.push("tx");              // 提醒为个人数据不共享给他人
        sync.fields.unshared.push("txs");             // 提醒为个人数据不共享给他人
        sync.fields.unshared.push("todolist");        // 待处理任务为个人数据不共享给他人
        sync.fields.unshared.push("wc");              // 完成状态为个人数据不共享给他人
        sync.fields.unshared.push("invitestatus");    // 接受拒绝状态为个人数据不共享给他人

        sync.src = agenda.ui;
        sync.id = agenda.evi;
        sync.type = "Agenda";
        sync.title = agenda.evn;
        sync.datetime = agenda.evd + " " + agenda.evt;

        // 非重复日程/重复日程的第一条需要通知
        if (!agenda.rtevi || agenda.rfg == RepeatFlag.RepeatToOnly) {
          sync.main = true;
        }

        sync.security = SyncDataSecurity.None;

        // 修改权限设定
        if (agenda.md == ModiPower.disable){
          sync.security = SyncDataSecurity.SelfModify;
        }
        if (agenda.md == ModiPower.enable){
          sync.security = SyncDataSecurity.ShareModify;
        }

        // 完成状态
        if (agenda.wc == EventFinishStatus.Finished) {
          sync.todostate = CompleteState.Completed;
        } else if (agenda.wc == EventFinishStatus.NonFinish) {
          sync.todostate = CompleteState.UnComplete;
        } else {
          sync.todostate = CompleteState.None;
        }

        // 设置删除状态
        if (agenda.del == DelType.del) {
          sync.status = SyncDataStatus.Deleted;
        } else {
          sync.status = SyncDataStatus.UnDeleted;
        }

        // 设置受邀状态
        if (agenda.invitestatus == InviteState.Accepted) {
          sync.invitestate = InviteState.Accepted;
        } else if (agenda.invitestatus == InviteState.Rejected) {
          sync.invitestate = InviteState.Rejected;
        } else {
          sync.invitestate = InviteState.None;
        }

        if (members.length > 0) {
          let parEvi: string;
          if (agenda.rtevi == "") {
            //非重复数据或重复数据的父记录
            parEvi = agenda.evi;
          } else {
            //重复数据
            parEvi = agenda.rtevi;
          }

          let membersTos: Array<Member> = members.filter((value, index, arr) => {
            return parEvi == value.obi;
          });
          agenda.tos = this.getMemberPhone(membersTos);

          // 把参与人添加到附件数据上
          currentAttachments = currentAttachments.reduce((target, ele) => {
            ele.members = membersTos;
            target.push(ele);

            return target;
          }, new Array<Attachment>());
        } else {
          let singlemembers: Array<Member> = new Array<Member>();
          //取得相关参与人
          if (agenda.members && agenda.members.length > 0) {
            singlemembers = agenda.members;
          }

          if (singlemembers.length > 0) {
            agenda.tos = this.getMemberPhone(singlemembers);

            // 把参与人添加到附件数据上
            currentAttachments = currentAttachments.reduce((target, ele) => {
              ele.members = singlemembers;
              target.push(ele);

              return target;
            }, new Array<Attachment>());
          }
        }
        sync.to = (!agenda.tos || agenda.tos == "" || agenda.tos == null) ? [] : agenda.tos.split(",") ;

        this.assertNotEqual(agenda.pn, sync.to.length); // 参与人数量和参与人数组必须相同

        sync.payload = this.cleanAgendaPayload(agenda);
        push.d.push(sync);

        // 先把附件数据进行同步
        if (currentAttachments && currentAttachments.length > 0) {
          await this.syncAttachments(currentAttachments);
        }

        index++;

        if (index % maxdata == 0) {
          await this.dataRestful.push(push);
          push = new PushInData();
        }
      }

      if (index % maxdata != 0) {
        await this.dataRestful.push(push);
      }
    }

		return ;
  }

  /**
   * 清除同步到云服务日程数据内容
   *
   * @author leon_xi@163.com
   */
  cleanAgendaPayload(payload: AgendaData): AgendaData {
    assertEmpty(payload);   // 入参不能为空

    let cleaned: AgendaData = {} as AgendaData;
    Object.assign(cleaned, payload);

    // 重复临时属性置空
    cleaned.rtjson = null;

    // 提醒临时属性置空
    cleaned.txjson = null;

    cleaned.attachments = [];

    // 清除参与人设备关联字段
    if (cleaned.members) {
      let members: Array<Member> = new Array<Member>();

      for (let member of cleaned.members) {
        member.bhiu = "";
        members.push(member);
      }

      cleaned.members = members;
    }

    return cleaned;
  }

  /**
   * 重建从云服务拉取的日程数据内容
   *
   * @author leon_xi@163.com
   */
  buildAgendaPayload(payload: AgendaData): AgendaData {
    assertEmpty(payload);   // 入参不能为空

    let built: AgendaData = {} as AgendaData;
    Object.assign(built, payload);



    return built;
  }

  /**
   * 完成日程同步,更新日程同步状态
   *
   * @author leon_xi@163.com
   */
  async acceptSyncAgendas(ids: Array<string>) {
    let sqls: Array<any> = new Array<any>();

    let sql: string = `update gtd_ev set tb = ? where evi in ('` + ids.join(', ') + `')`;

    sqls.push([sql, [SyncType.synch]]);

    await this.sqlExce.batExecSqlByParam(sqls);

    // 同步完成后刷新缓存
    for (let id of ids) {
      this.getAgenda(id).then((agenda) => {
        if (agenda) {
          this.emitService.emit("mwxing.calendar.activities.changed", agenda);
        }
      });
    }
  }

	/**
	 * 发送任务进行共享
	 * @author ying<343253410@qq.com>
	 */
  async sendTask(tt: TaskData) {
  	this.assertEmpty(tt);
  	this.assertNotEqual(tt.type, anyenum.EventType.Task);  //不是任务不能发送共享
  	await this.syncTask(tt);
  	return ;
  }

  /**
   * 发送小任务进行共享
   * @author ying<343253410@qq.com>
   */
  async sendMiniTask(tt: MiniTaskData) {
  	this.assertEmpty(tt);
  	this.assertNotEqual(tt.type, anyenum.EventType.MiniTask);  //不是任务不能发送共享
  	await this.syncMiniTask(tt);
  	return ;
  }


  /**
   * 接收任务
   * @author ying<343253410@qq.com>
   */
  async receivedTask(evi: string) {
  	this.assertEmpty(evi);   // 入参不能为空
		let pull: PullInData = new PullInData();
    pull.type = "Task";
		pull.d.push(evi);
		await this.dataRestful.pull(pull);
		return;
  }

  /**
   * 接受邀请
   *
   * @author leon_xi@163.com
   */
  async acceptReceivedAgenda(evi: string): Promise<AgendaData> {
    this.assertEmpty(evi);       // 入参不能为空

    let origin: AgendaData = await this.getAgenda(evi);

    let current: AgendaData = {} as AgendaData;
    Object.assign(current, origin);

    current.invitestatus = InviteState.Accepted;

    let saved = await this.saveAgenda(current, origin);

    return current;
  }

  /**
   * 拒绝邀请
   *
   * @author leon_xi@163.com
   */
  async rejectReceivedAgenda(evi: string): Promise<AgendaData> {
    this.assertEmpty(evi);       // 入参不能为空

    let origin: AgendaData = await this.getAgenda(evi);

    let current: AgendaData = {} as AgendaData;
    Object.assign(current, origin);

    current.invitestatus = InviteState.Rejected;
    current.del = DelType.del;                     // 拒绝的日程设置为删除, 从用户日历显示中删除

    let saved = await this.saveAgenda(current, origin);

    return current;
  }

  /**
   * 接收任务保存到本地
   * @author ying<343253410@qq.com>
   */
  async acceptReceivedTask(task: TaskData, status: SyncDataStatus): Promise<TaskData> {
  	this.assertEmpty(task);     // 入参不能为空
    this.assertEmpty(task.evi);  // ID不能为空
    this.assertNotEqual(task.type, anyenum.EventType.Task);  //不是任务不能发送共享
    this.assertEmpty(status);   // 入参不能为空

    task.del = status;
    task.tb = SyncType.synch;

    let sqls: Array<any> = new Array<any>();

    let evdb: EvTbl = new EvTbl();
    Object.assign(evdb, task);
    sqls.push(evdb.rpTParam());

    let tdb: TTbl = new TTbl();
    Object.assign(tdb, task);
    sqls.push(tdb.rpTParam());

    await this.sqlExce.batExecSqlByParam(sqls);

    this.emitService.emit("mwxing.calendar.activities.changed", task);

    return task;
  }

  /**
   * 接收小任务保存到本地
   * @author ying<343253410@qq.com>
   */
  async acceptReceivedMiniTask(tt: MiniTaskData,status: SyncDataStatus): Promise<MiniTaskData> {
  	this.assertEmpty(tt);     // 入参不能为空
    this.assertEmpty(tt.evi);  // ID不能为空
    this.assertNotEqual(tt.type, anyenum.EventType.MiniTask);  //不是任务不能发送共享
    this.assertEmpty(status);   // 入参不能为空

    let evdb: EvTbl = new EvTbl();
    Object.assign(evdb, tt);
    evdb.del = status;
    evdb.tb = SyncType.synch;
    await this.sqlExce.repTByParam(evdb);
    let backMEvent: MiniTaskData = {} as MiniTaskData;
    Object.assign(backMEvent, evdb);
    return backMEvent;
  }

  rejectReceivedEvent() {}

  /**
   * 同步任务到服务器
   * @author ying<343253410@qq.com>
   */
  async syncTask(task: TaskData) {

  	this.assertEmpty(task);       // 入参不能为空
	  this.assertEmpty(task.evi);    // ID不能为空
	  this.assertEmpty(task.del);   // 删除标记不能为空

	  let push: PushInData = new PushInData();
	  let sync: SyncData = new SyncData();
	  sync.id = task.evi;
    sync.type = "Task";

    //修改权限设定
    if (task.md == anyenum.ModiPower.disable){
      sync.security = SyncDataSecurity.SelfModify;
    }
    if (task.md == anyenum.ModiPower.enable){
      sync.security = SyncDataSecurity.ShareModify;
    }

    //删除设定
    if (task.del == anyenum.DelType.del){
      sync.status = SyncDataStatus.Deleted;
    } else {
      sync.status = SyncDataStatus.UnDeleted;
    }

    sync.payload = task;
    push.d.push(sync);
    await this.dataRestful.push(push);

    return ;
  }

  /**
   * 同步小任务到服务器
   * @author ying<343253410@qq.com>
   */
  async syncMiniTask(tt: MiniTaskData) {
  	this.assertEmpty(tt);       // 入参不能为空
	  this.assertEmpty(tt.evi);    // ID不能为空
	  this.assertEmpty(tt.del);   // 删除标记不能为空

	  let push: PushInData = new PushInData();
	  let sync: SyncData = new SyncData();
	  sync.id = tt.evi;
    sync.type = "MiniTask";
    sync.security = SyncDataSecurity.None;
    sync.status = SyncDataStatus[tt.del];
    sync.payload = tt;
    push.d.push(sync);
    await this.dataRestful.push(push);
    return;
  }

  /***
  * 新增附件
  **@author ying<343253410@qq.com>
  */

  async saveAttachment(att: Attachment): Promise<Attachment> {
    this.assertEmpty(att);       // 入参不能为空
    this.assertEmpty(att.fjn);    // 附件名称
    this.assertEmpty(att.obt);
    this.assertEmpty(att.obi);

    //创建主键
    att.fji = this.util.getUuid();
    let fjdb: FjTbl = new FjTbl();
    Object.assign(fjdb, att);

    //新增数据
    await this.sqlExce.saveByParam(fjdb);

    //同步数据
    this.emitService.emit("mwxing.event.fj.add", att);
    await this.syncAttachments([att], async (updated) => {
      let fjdb: FjTbl = new FjTbl();
      Object.assign(fjdb, updated);

      //更新数据
      await this.sqlExce.saveByParam(fjdb);

      att = updated;
    });

    return att;
  }

  /***
  * 删除附件
  **@author ying<343253410@qq.com>
  */
  async removeAttachment(att: Attachment): Promise<Attachment> {
    this.assertEmpty(att);
    this.assertEmpty(att.fji);

    att.del = DelType.del;
    att.tb = SyncType.unsynch;
    let fjdb: FjTbl = new FjTbl();
    Object.assign(fjdb, att);

    //更新本地数据库
    await this.sqlExce.updateByParam(fjdb);

    //同步数据
    this.emitService.emit("mwxing.event.fj.changed", att);
    this.syncAttachments([att]);

    return att;
  }

  /**
   * 查询全部的附件信息
   * @author ying<343253410@qq.com>
   */
    async selectAttachments() {
      let attachments: Array<Attachment> = new Array<Attachment>();
      let sql: string = `select * from gtd_fj  where del = ? order by wtt asc`;
      let fjs = await this.sqlExce.getExtLstByParam<Attachment>(sql, [DelType.undel]);
      if(fjs && fjs.length>0) {
        for (let fj of fjs) {
          let at: Attachment = {} as Attachment;
          Object.assign(at, fj);
          let cacheFilePathJson: CacheFilePathJson = new CacheFilePathJson();
          cacheFilePathJson.local = "/"+fj.fjn;
          at.fpjson = cacheFilePathJson;
          attachments.push(at);
        }
      }
      return attachments;
    }




  /**
   * 同步全部的未同步的任务到服务器
   * @author ying<343253410@qq.com>
   */
  async syncTasks() {
  	let sql: string = `select * from gtd_ev where type = ? and   tb = ?`;
		let unsyncedtasks = await this.sqlExce.getExtLstByParam<TaskData>(sql, [anyenum.EventType.Task, SyncType.unsynch]);
		//当存在未同步的情况下,进行同步
		if (unsyncedtasks && unsyncedtasks.length > 0) {
			 let push: PushInData = new PushInData();
			 for (let tt of unsyncedtasks) {
			 	 	let sync: SyncData = new SyncData();
			 	 	sync.id = tt.evi;
			    sync.type = "Task";
			    sync.security = SyncDataSecurity.None;
			    sync.status = SyncDataStatus[tt.del];
			    sync.payload = tt;
			    push.d.push(sync);
			 }
			 await this.dataRestful.push(push);
		}
		return ;
  }

  /**
   * 同步全部的未同步的小任务到服务器
   * @author ying<343253410@qq.com>
   */
  async syncMiniTasks() {
  	let sql: string = `select * from gtd_ev where type = ? and   tb = ?`;
		let unsyncedminitasks = await this.sqlExce.getExtLstByParam<TaskData>(sql, [anyenum.EventType.MiniTask, SyncType.unsynch]);
		//当存在未同步的情况下,进行同步
		if (unsyncedminitasks && unsyncedminitasks.length > 0) {
			 let push: PushInData = new PushInData();
			 for (let tt of unsyncedminitasks) {
			 	 	let sync: SyncData = new SyncData();
			 	 	sync.id = tt.evi;
			    sync.type = "MiniTask";
			    sync.security = SyncDataSecurity.None;
			    sync.status = SyncDataStatus[tt.del];
			    sync.payload = tt;
			    push.d.push(sync);
			 }
			 await this.dataRestful.push(push);
		}
		return ;
  }

  /**
	 * 根据年月日检索任务  只检索任务,不检索小任务
	 * @author ying<343253410@qq.com>
	 */
  async fetchPagedTasks(day: string = moment().format('YYYY/MM/DD'), direction: PageDirection = PageDirection.PageInit): Promise<Array<TaskData>>{
  	this.assertEmpty(day);         // 验证日期是否为空
    this.assertEmpty(direction);   // 入参不能为空

    let pagetasks: Array<TaskData> = new Array<TaskData>();
    let today: string = moment().format('YYYY/MM/DD');
    let top: string = day;
    let bottom: string = moment(day).add(1, "days").format('YYYY/MM/DD');

    // 下拉刷新时需要减一天
    if (direction == PageDirection.PageDown) {
      top = moment(day).subtract(1, "days").format('YYYY/MM/DD');
    }

    if (direction == PageDirection.PageInit || direction == PageDirection.PageDown) {
      let sql: string = `select distinct task.*, tt.cs, tt.isrt, tt.cd, tt.fd
                        from (
                          select evpage.day evd, ev.*
                          from (
                            select evnext.day day, julianday(replace(?1, '/', '-'), '+1 days') - julianday(replace(evnext.day, '/', '-')) sortid
                            from (
                              select distinct page1.evd day, page1.type, page1.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page1
                              where page1.cs = '1' or (page1.cs = '0' and date(replace(page1.evd, '/', '-')) > date(replace(?4, '/', '-')))
                              union all
                              select distinct ?4 day, page0.type, page0.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page0
                              where page0.cs = '0' and date(replace(page0.evd, '/', '-')) <= date(replace(?4, '/', '-'))
                            ) evnext
                            where evnext.type = ?2 and evnext.del = ?3 and julianday(replace(evnext.day, '/', '-')) < julianday(replace(?1, '/', '-'), '+1 days')
                            order by sortid
                            limit 5
                          ) evpage
                          left join (
                            select page1.evd day, page1.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page1
                            where page1.cs = '1' or (page1.cs = '0' and date(replace(page1.evd, '/', '-')) > date(replace(?4, '/', '-')))
                            union all
                            select ?4 day, page0.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page0
                            where page0.cs = '0' and date(replace(page0.evd, '/', '-')) <= date(replace(?4, '/', '-'))
                          ) ev
                          on ev.day = evpage.day
                        ) task
                        left join gtd_t tt
                        on tt.evi = task.evi
                        order by task.evd asc`;

      let data: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(sql, [top, anyenum.EventType.Task, DelType.undel, today]);

      if (data && data.length > 0) {
        pagetasks = data;
      }
    }

    if (direction == PageDirection.PageInit || direction == PageDirection.PageUp) {
      let sql: string = `select distinct task.*, tt.cs, tt.isrt, tt.cd, tt.fd
                        from (
                          select evpage.day evd, ev.*
                          from (
                            select evnext.day day, julianday(replace(evnext.day, '/', '-')) - julianday(replace(?1, '/', '-'), '+1 days') sortid
                            from (
                              select distinct page1.evd day, page1.type, page1.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page1
                              where page1.cs = '1' or (page1.cs = '0' and date(replace(page1.evd, '/', '-')) > date(replace(?4, '/', '-')))
                              union all
                              select distinct ?4 day, page0.type, page0.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page0
                              where page0.cs = '0' and date(replace(page0.evd, '/', '-')) <= date(replace(?4, '/', '-'))
                            ) evnext
                            where evnext.type = ?2 and evnext.del = ?3 and julianday(replace(evnext.day, '/', '-')) > julianday(replace(?1, '/', '-'), '+1 days')
                            order by sortid
                            limit 5
                          ) evpage
                          left join (
                            select page1.evd day, page1.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page1
                            where page1.cs = '1' or (page1.cs = '0' and date(replace(page1.evd, '/', '-')) > date(replace(?4, '/', '-')))
                            union all
                            select ?4 day, page0.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page0
                            where page0.cs = '0' and date(replace(page0.evd, '/', '-')) <= date(replace(?4, '/', '-'))
                          ) ev
                          on ev.day = evpage.day
                        ) task
                        left join gtd_t tt
                        on tt.evi = task.evi
                        order by task.evd asc`;

      let data: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(sql, [bottom, anyenum.EventType.Task, DelType.undel, today]);

      if (data && data.length > 0) {
        pagetasks = pagetasks.concat(data);
      }
    }

  	return pagetasks;
  }

  /**
	 * 检索完成任务
	 * @author ying<343253410@qq.com>
	 */
  async fetchPagedCompletedTasks(day: string = moment().format('YYYY/MM/DD'), direction: PageDirection = PageDirection.PageInit): Promise<Array<TaskData>> {
    this.assertEmpty(day);         // 验证日期是否为空
    this.assertEmpty(direction);   // 入参不能为空

    let pagetasks: Array<TaskData> = new Array<TaskData>();
    let top: string = day;
    let bottom: string = moment(day).add(1, "days").format('YYYY/MM/DD');

    // 下拉刷新时需要减一天
    if (direction == PageDirection.PageDown) {
      top = moment(day).subtract(1, "days").format('YYYY/MM/DD');
    }

    if (direction == PageDirection.PageInit || direction == PageDirection.PageDown) {
      let sql: string = `select distinct task.*, tt.cs, tt.isrt, tt.cd, tt.fd
                        from (
                          select evpage.day evd, ev.*
                          from (
                            select evnext.day day, julianday(replace(?1, '/', '-'), '+1 days') - julianday(replace(evnext.day, '/', '-')) sortid
                            from (
                              select distinct page1.evd day, page1.type, page1.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page1
                              where page1.cs = '1'
                            ) evnext
                            where evnext.type = ?2 and evnext.del = ?3 and julianday(replace(evnext.day, '/', '-')) < julianday(replace(?1, '/', '-'), '+1 days')
                            order by sortid
                            limit 5
                          ) evpage
                          left join (
                            select page1.evd day, page1.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page1
                            where page1.cs = '1'
                          ) ev
                          on ev.day = evpage.day
                        ) task
                        left join gtd_t tt
                        on tt.evi = task.evi
                        order by task.evd asc`;

      let data: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(sql, [top, anyenum.EventType.Task, DelType.undel]);

      if (data && data.length > 0) {
        pagetasks = data;
      }
    }

    if (direction == PageDirection.PageInit || direction == PageDirection.PageUp) {
      let sql: string = `select distinct task.*, tt.cs, tt.isrt, tt.cd, tt.fd
                        from (
                          select evpage.day evd, ev.*
                          from (
                            select evnext.day day, julianday(replace(evnext.day, '/', '-')) - julianday(replace(?1, '/', '-'), '+1 days') sortid
                            from (
                              select distinct page1.evd day, page1.type, page1.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page1
                              where page1.cs = '1'
                            ) evnext
                            where evnext.type = ?2 and evnext.del = ?3 and julianday(replace(evnext.day, '/', '-')) > julianday(replace(?1, '/', '-'), '+1 days')
                            order by sortid
                            limit 5
                          ) evpage
                          left join (
                            select page1.evd day, page1.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page1
                            where page1.cs = '1'
                          ) ev
                          on ev.day = evpage.day
                        ) task
                        left join gtd_t tt
                        on tt.evi = task.evi
                        order by task.evd asc`;

      let data: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(sql, [bottom, anyenum.EventType.Task, DelType.undel]);

      if (data && data.length > 0) {
        pagetasks = pagetasks.concat(data);
      }
    }

  	return pagetasks;
  }

  /**
	 * 检索未完成的任务
	 * @author ying<343253410@qq.com>
	 */
  async fetchPagedUncompletedTasks(day: string = moment().format('YYYY/MM/DD'), direction: PageDirection = PageDirection.PageInit): Promise<Array<TaskData>> {
    this.assertEmpty(day);         // 验证日期是否为空
    this.assertEmpty(direction);   // 入参不能为空

    let pagetasks: Array<TaskData> = new Array<TaskData>();
    let today: string = moment().format('YYYY/MM/DD');
    let top: string = day;
    let bottom: string = moment(day).add(1, "days").format('YYYY/MM/DD');

    // 下拉刷新时需要减一天
    if (direction == PageDirection.PageDown) {
      top = moment(day).subtract(1, "days").format('YYYY/MM/DD');
    }

    if (direction == PageDirection.PageInit || direction == PageDirection.PageDown) {
      let sql: string = `select distinct task.*, tt.cs, tt.isrt, tt.cd, tt.fd
                        from (
                          select evpage.day evd, ev.*
                          from (
                            select evnext.day day, julianday(replace(?1, '/', '-'), '+1 days') - julianday(replace(evnext.day, '/', '-')) sortid
                            from (
                              select distinct page1.evd day, page1.type, page1.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page1
                              where page1.cs = '0' and date(replace(page1.evd, '/', '-')) > date(replace(?4, '/', '-'))
                              union all
                              select distinct ?4 day, page0.type, page0.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page0
                              where page0.cs = '0' and date(replace(page0.evd, '/', '-')) <= date(replace(?4, '/', '-'))
                            ) evnext
                            where evnext.type = ?2 and evnext.del = ?3 and julianday(replace(evnext.day, '/', '-')) < julianday(replace(?1, '/', '-'), '+1 days')
                            order by sortid
                            limit 5
                          ) evpage
                          left join (
                            select page1.evd day, page1.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page1
                            where page1.cs = '0' and date(replace(page1.evd, '/', '-')) > date(replace(?4, '/', '-'))
                            union all
                            select ?4 day, page0.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page0
                            where page0.cs = '0' and date(replace(page0.evd, '/', '-')) <= date(replace(?4, '/', '-'))
                          ) ev
                          on ev.day = evpage.day
                        ) task
                        left join gtd_t tt
                        on tt.evi = task.evi
                        order by task.evd asc`;

      let data: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(sql, [top, anyenum.EventType.Task, DelType.undel, today]);

      if (data && data.length > 0) {
        pagetasks = data;
      }
    }

    if (direction == PageDirection.PageInit || direction == PageDirection.PageUp) {
      let sql: string = `select distinct task.*, tt.cs, tt.isrt, tt.cd, tt.fd
                        from (
                          select evpage.day evd, ev.*
                          from (
                            select evnext.day day, julianday(replace(evnext.day, '/', '-')) - julianday(replace(?1, '/', '-'), '+1 days') sortid
                            from (
                              select distinct page1.evd day, page1.type, page1.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page1
                              where page1.cs = '0' and date(replace(page1.evd, '/', '-')) > date(replace(?4, '/', '-'))
                              union all
                              select distinct ?4 day, page0.type, page0.del
                              from (
                                select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                                from gtd_ev ev
                                left join gtd_t tt
                                on tt.evi = ev.evi
                                where ev.type = ?2
                              ) page0
                              where page0.cs = '0' and date(replace(page0.evd, '/', '-')) <= date(replace(?4, '/', '-'))
                            ) evnext
                            where evnext.type = ?2 and evnext.del = ?3 and julianday(replace(evnext.day, '/', '-')) > julianday(replace(?1, '/', '-'), '+1 days')
                            order by sortid
                            limit 5
                          ) evpage
                          left join (
                            select page1.evd day, page1.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page1
                            where page1.cs = '0' and date(replace(page1.evd, '/', '-')) > date(replace(?4, '/', '-'))
                            union all
                            select ?4 day, page0.*
                            from (
                              select ev.*, tt.cs, tt.isrt, tt.cd, tt.fd
                              from gtd_ev ev
                              left join gtd_t tt
                              on tt.evi = ev.evi
                              where ev.type = ?2
                            ) page0
                            where page0.cs = '0' and date(replace(page0.evd, '/', '-')) <= date(replace(?4, '/', '-'))
                          ) ev
                          on ev.day = evpage.day
                        ) task
                        left join gtd_t tt
                        on tt.evi = task.evi
                        order by task.evd asc`;

      let data: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(sql, [bottom, anyenum.EventType.Task, DelType.undel, today]);

      if (data && data.length > 0) {
        pagetasks = pagetasks.concat(data);
      }
    }

  	return pagetasks;
  }

  /**
	 * 检索所有未完成的任务
   *
	 * @author leon_xi@163.com
	 */
  async fetchUncompletedTasks(): Promise<Array<TaskData>> {
    let sql: string = `select ev.*, t.cs, t.isrt, t.cd, t.fd
                      from gtd_ev ev
                      left join gtd_t t
                      on t.evi = ev.evi
                      where ev.del = ?1 and ev.type = ?2 and t.cs = ?3
                      order by ev.evd asc, ev.evt asc`;

    let tasks: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(sql, [DelType.undel, anyenum.EventType.Task, IsSuccess.wait]) || new Array<TaskData>();

    return tasks;
  }

  /**
   * 合并待处理任务列表
   *
   * 返回原待处理任务列表数组对象，控制页面刷新
   *
   * @author leon_xi@163.com
   **/
  mergeUncompletedTasks(tasks: Array<TaskData>, changed: TaskData) {
    let activityType: string = this.getEventType(changed);

    if (activityType != "TaskData") {
      return tasks;
    }

    let taskids: Array<string> = new Array<string>();

    tasks.reduce((taskids, value) => {
      taskids.push(value.evi);
      return taskids;
    }, taskids);

    // 更新原有任务信息
    let index: number = taskids.indexOf(changed.evi);
    if (index >= 0) {
      if (changed.cs != IsSuccess.success) {
        tasks[index] = changed;
      } else {
        tasks.splice(index, 1);
      }
    } else {
      if (changed.cs != IsSuccess.success) {
        let newIndex: number = tasks.findIndex((val, index, arr) => {
          return moment(val.evd + ' ' + val.evt).diff(changed.evd + ' ' + changed.evt) >= 0;
        });

        if (newIndex > 0) {
          tasks.splice(newIndex - 1, 0, changed);
        } else if (newIndex == 0) {
          tasks.unshift(changed);
        } else {
          tasks.push(changed);
        }
      }
    }

    return tasks;
  }

  	/**
  	 * 查询获取todolist的数据
  	 * 内容  时间 年月日
  	 * @author ying<343253410@qq.com>
  	 */
  async todolist(): Promise<Array<AgendaData>> {
   	 let sql: string = `
                        select
                        eex.evi,
                        eex.evn,
                        eex.ui,
                        eex.mi,
                        eex.evd,
                        eex.evt,
                        eex.newrtevi as rtevi,
                        eex.ji,
                        eex.bz,
                        eex.type,
                        eex.tx,
                        eex.txs,
                        eex.rt,
                        eex.rts,
                        eex.fj,
                        eex.pn,
                        eex.md,
                        eex.iv,
                        eex.sr,
                        eex.wtt,
                        eex.utt,
                        eex.gs,
                        eex.tb,
                        eex.wc,
                        eex.todolist,
                        eex.del,
                        eex.rfg,
                        eex.invitestatus,
                        eex.adr,
                        eex.adrx,
                        eex.adry,
                        ca.sd,
                        ca.ed,
                        ca.st,
                        ca.et,
                        ca.al,
                        ca.ct
                        from (
                         select * from (
                                select * from (
                                      select evnext.* ,MIN(evnext.day) as minDay from (
                                              select  evv.*,
                                              ABS(julianday(datetime(replace(evv.evd, '/', '-'),evv.evt)) - julianday(datetime('now'))) day
                                              from (
                                                     select ev.*,
                                                     case when ifnull(ev.rtevi,'') <> ''  then  ev.rtevi  else ev.evi end newrtevi
                                                    from gtd_ev ev
                                                    where ev.todolist = ?1 and ev.del = ?2 and ev.type = ?3 and ev.wc = ?4
                                              ) evv
                                      ) evnext
                                      group by evnext.newrtevi
                                ) evnext2 where  julianday(datetime(replace(evnext2.evd, '/', '-'),evnext2.evt))<julianday(datetime('now'))
                                and evnext2.newrtevi not in (
                                  select
                                  case when ifnull(evk.rtevi,'') <> ''  then  evk.rtevi  else evk.evi end newrtevi
                                  from gtd_ev evk
                                  where evk.todolist = ?1  and evk.type = ?3 and evk.wc = ?5
                                )
                              order by  evnext2.minDay desc
                     )
                    union all
                    select *  from (
                            select * from (
                                    select evnext.* ,MIN(evnext.day) as minDay from (
                                          select  evv.*,
                                          ABS(julianday(datetime(replace(evv.evd, '/', '-'),evv.evt)) - julianday(datetime('now'))) day
                                          from (
                                                  select ev.*,
                                                  case when ifnull(ev.rtevi,'') <> ''  then  ev.rtevi  else ev.evi end newrtevi
                                                  from gtd_ev ev
                                                  where ev.todolist = ?1 and ev.del = ?2 and ev.type = ?3 and ev.wc = ?4
                                          ) evv
                                    ) evnext
                                    group by evnext.newrtevi
                            ) evnext2 where   julianday(datetime(replace(evnext2.evd, '/', '-'),evnext2.evt))>=julianday(datetime('now'))
                            order by  evnext2.minDay asc
                    )) eex left join gtd_ca ca on ca.evi = eex.newrtevi
                       	`;
      let agendaArray: Array<AgendaData> = await this.sqlExce.getExtLstByParam<AgendaData>(sql, [anyenum.ToDoListStatus.On,anyenum.DelType.undel,anyenum.EventType.Agenda,anyenum.EventFinishStatus.NonFinish,anyenum.EventFinishStatus.Finished]) || new Array<AgendaData>();
  		return agendaArray;
   }
   /**
   *有数据更新或者新增，自动刷新页面
   * 当有新的数据加入时，则对原有的数据进行从新排列
   * @author ying<343253410@qq.com>
   */
  async mergeTodolist(todolist: Array<AgendaData>, changedNew: AgendaData): Promise<Array<AgendaData>> {
      //传入数据不能为空
      this.assertEmpty(changedNew);
      let changed: AgendaData = {} as AgendaData;
      Object.assign(changed, changedNew);
      let agendaArray: Array<AgendaData> = new Array<AgendaData>();
      let flag: boolean = true;
      //当数据retevi为空的情况下
      if(!changed.rtevi) {
          changed.rtevi = changed.evi;
      }
      if (todolist.length == 0) {
          //当缓存时间为空的情况下，新加入todoList
          if ( ( changed.todolist == anyenum.ToDoListStatus.On ) && ( changed.del == anyenum.DelType.undel ) && (changed.wc == anyenum.EventFinishStatus.NonFinish) )
          {
                //将数据加入到todolist缓存
                todolist.push(changed);
          }
          flag = false;

      }
      else {
        if ( (  changed.todolist == anyenum.ToDoListStatus.Off ) || ( changed.del == anyenum.DelType.del ) || (changed.wc == anyenum.EventFinishStatus.Finished) ) {
                //移除数据 取消todolist、删除 、 事件完成
                let j: number = 0;
                for (let td of todolist) {
                  if ( (td.evi == changed.evi) || (td.rtevi == changed.evi ) ) {
                      todolist.splice(j, 1);
                  }
                  j++;
                }
                //当前事件已完成，验证当前事件是否为重复事件，如果为重复事件，则删除当前的，重新插入下一个
                //当是重复性事件的情况下，已完成或者已删除的状态下，都需要检索出下一条临近的数据
                if ((changed.todolist != anyenum.ToDoListStatus.Off) && ((changed.rfg == RepeatFlag.Repeat)||(changed.rfg == RepeatFlag.RepeatToOnly))) {
                  let newsql : string  =  ` select ev.*,
                  ca.sd,ca.st,ca.ed,ca.et,ca.ct
                   from
                      gtd_ev ev left join gtd_ca ca on ca.evi = ev.rtevi
                        where
                        ev.rtevi =?1
                        and ev.del = ?2
                        and ev.type = ?3
                        and ev.wc = ?4
                        and (julianday(datetime(replace(ev.evd, '/', '-'),ev.evt)) > julianday(datetime(replace(?5, '/', '-'),?6)))
                        order by ev.evd asc `;
                  let rtevi: string = changed.rtevi;
                  // if (changed.rtevi == '') {
                  //     rtevi = changed.evi;
                  // }
                  // else {
                  //     rtevi = changed.rtevi;
                  // }
                  let ag1: Array<AgendaData> = await this.sqlExce.getExtLstByParam<AgendaData>(newsql,
                     [rtevi,anyenum.DelType.undel,anyenum.EventType.Agenda,anyenum.EventFinishStatus.NonFinish,changed.evd,changed.evt]) || new Array<AgendaData>();
                  if (ag1&&ag1.length>0){
                        changed = ag1[0];
                        if(todolist.length==0)
                        {
                           todolist.push(changed);
                           flag = false;
                        }
                  }
                  else {
                     flag = false;
                  }
                }
                else {
                   flag = false;
                }
        }
        if (flag) {

          //验证当前todolist是否已存在相同的evi数据，如果存在，删除，然后在进行重新排序
          let jfk: number = 0;
          for(let td of todolist) {
              if((changed.evi == td.evi)||(changed.rtevi == td.rtevi)||(changed.rtevi == td.evi)) {
                  todolist.splice(jfk, 1);
                  break;
              }
              jfk++;
          }

          //将数据加到新的排序中去
          //todolist已经进行过排序，按照日期排列 ,快速排序算法，还是太慢，
          //1.新加入的事件的日期，比todolist第一个日期还小,缩短循环排序时间
          if ((moment(changed.evd + ' ' + changed.evt).diff(todolist[0].evd + ' ' + todolist[0].evt)<=0)) {
              todolist.unshift(changed);
              return todolist;
          }

          //2.新加入的事件的日期，比todolist的最后一个日期还小
          if (moment(changed.evd + ' ' + changed.evt).diff(todolist[todolist.length-1].evd + ' ' + todolist[todolist.length-1].evt)>=0) {
              todolist.push(changed);
              return todolist;
          }

          //3. 当事件的日期，在todolist中间时
          let i: number = 0;
          for (let td of todolist) {
            //todolist 已经是按照日期顺序排列好的，然后根据日期大小进行排序，当change的日期比todolist的小的时候插入进去
            if(((moment(changed.evd + ' ' + changed.evt).diff(td.evd + ' ' + td.evt) <0 ))) {
              todolist.splice(i,0,changed);
              return todolist;
            }
            i++;
          }
        }
      }
      //更新相关实体数据内容
      //this.saveAgenda(changed);
      return todolist;
  }

  /**
   * 取得事件类型
   *
   * @author leon_xi@163.com
   **/
  getEventType(source: AgendaData | TaskData | MiniTaskData): string {

    this.assertEmpty(source);

    let src: any = source;

    if (src.evi && src.ed) {    // AgendaData
      return "AgendaData";
    }

    if (src.evi && src.cs) {    // TaskData
      return "TaskData";
    }

    if (src.evi && !src.cs && !src.ed) {    // MiniTaskData
      return "MiniTaskData";
    }

    this.assertFail();
  }

  /**
   * 备份,三张表备份
	 * @author ying<343253410@qq.com>
   */
  async backup(bts: number) {
  	let backupPro: BackupPro = new BackupPro();
		//操作账户ID
		backupPro.oai = UserConfig.account.id
		//操作手机号码
		backupPro.ompn = UserConfig.account.phone;
		//时间戳
		backupPro.d.bts = bts;
		//备份事件表
		let ev = new EvTbl();
  	backupPro.d.ev = await this.sqlExce.getLstByParam <EvTbl> (ev);
  	//备份日程表
  	let ca = new CaTbl();
  	backupPro.d.ca = await this.sqlExce.getLstByParam <CaTbl> (ca);
  	//备份任务表
  	let tt = new TTbl();
  	backupPro.d.tt = await this.sqlExce.getLstByParam <TTbl> (tt);
		await this.bacRestful.backup(backupPro);
		return ;

  }

  /**
   * 恢复事件
   *
	 * @author leon_xi@163.com
   */
  recovery(recoveries: OutRecoverPro): Array<any> {
		this.assertNull(recoveries);

    let sqls: Array<any> = new Array<any>();

		//恢复事件表
    let events = recoveries.ev;

    // 删除事件
    sqls.push([`delete from gtd_ev;`, []]);

    // 恢复备份事件
    for (let event of events) {
      let eventdb: EvTbl = new EvTbl();
      Object.assign(eventdb, event);

      sqls.push(eventdb.inTParam());
    }

		//恢复日程表
    let agendas = recoveries.ca;

    // 删除日程
    sqls.push([`delete from gtd_ca;`, []]);

    // 恢复备份日程
    for (let agenda of agendas) {
      let agendadb: CaTbl = new CaTbl();
      Object.assign(agendadb, agenda);

      sqls.push(agendadb.inTParam());
    }

		//恢复任务表
    let tasks = recoveries.tt;

    // 删除任务
    sqls.push([`delete from gtd_t;`, []]);

    // 恢复备份任务
    for (let task of tasks) {
      let taskdb: TTbl = new TTbl();
      Object.assign(taskdb, task);

      sqls.push(taskdb.inTParam());
    }

		return sqls;
  }

  /**
   * 恢复
	 * @author ying<343253410@qq.com>
   */
  /*async recovery(outRecoverPro: OutRecoverPro, bts: Number = 0) {
  	if (bts == 0) {
			this.assertNull(outRecoverPro);
		}
		let outRecoverProNew: OutRecoverPro = new OutRecoverPro();
		if (bts != 0) {
			let recoverPro: RecoverPro = new RecoverPro();
			//操作账户ID
			recoverPro.oai = UserConfig.account.id;
			//操作手机号码
			recoverPro.ompn = UserConfig.account.phone;
			recoverPro.d.bts = bts;
			let rdn = new Array <string> ();
			rdn.push('ev');
			rdn.push('ca');
			rdn.push('tt');
			recoverPro.d.rdn = rdn;
			outRecoverProNew = await this.bacRestful.recover(recoverPro);
		} else {
			outRecoverProNew = outRecoverPro;
		}
		//恢复事件表
		if (outRecoverProNew.ev.length > 0) {
			let ev = new EvTbl();
			let sqls = new Array <string> ();
			//先删除
			await this.sqlExce.delByParam(ev);
			//恢复数据
			for(let j = 0, len = outRecoverProNew.ev.length; j < len; j++) {
				let ev = new EvTbl();
				Object.assign(ev, outRecoverProNew.ev[j]);
				sqls.push(ev.inTParam());
			}
			await this.sqlExce.batExecSqlByParam(sqls);
		}
		//恢复日程表
		if (outRecoverProNew.ca.length > 0) {
			let ca = new CaTbl();
			let sqls = new Array <string> ();
			//先删除
			await this.sqlExce.delByParam(ca);
			//恢复数据
			for(let j = 0, len = outRecoverProNew.ca.length; j < len; j++) {
				let ca = new CaTbl();
				Object.assign(ca, outRecoverProNew.ca[j]);
				sqls.push(ca.inTParam());
			}
			await this.sqlExce.batExecSqlByParam(sqls);
		}
		//恢复任务表
		if (outRecoverProNew.tt.length > 0) {
			let tt = new TTbl();
			let sqls = new Array <string> ();
			//先删除
			await this.sqlExce.delByParam(tt);
			//恢复数据
			for(let j = 0, len = outRecoverProNew.tt.length; j < len; j++) {
				let tt = new TTbl();
				Object.assign(tt, outRecoverProNew.tt[j]);
				sqls.push(tt.inTParam());
			}
			await this.sqlExce.batExecSqlByParam(sqls);
		}
		return ;
  }*/
}

export interface EventData extends EvTbl {
  //重复设定
  rtjson :RtJson;
  //提醒设定
  txjson :TxJson;
}

//画面传入事件service参数体
export interface AgendaData extends EventData, CaTbl {

  //参与人
  members : Array<Member>;
  //计划
  jha : JhaTbl;
  //发起人
  originator: Member;

  //附件
  attachments : Array<Attachment>;

  //用于数据上传给服务器时，给哪些参与人，[]无参与人或参与人被全删
  tos : string;

}

export interface  Member extends ParTbl{

  ran: string ; //联系人别称
  ranpy: string; //联系人别称拼音
  hiu: string ;  // 联系人头像
  rn: string ;  // 联系人名称
  rnpy: string ;  //联系人名称拼音
  rc: string ;  //联系人联系方式
  rel: string; //系类型 1是个人，2是群，0未注册用户
  src : string;//联系人来源
  bhi: string ; //头像表ID 用于判断是否有头像记录
  bhiu:string ;//base64图片

}

//附件对象
export interface Attachment extends FjTbl {
  fpjson: CacheFilePathJson;
  //参与人
  members: Array<Member>;
  //附件地址
  fjurl: string;
}

export class CacheFilePathJson {
  cachedir: string = "/cached";
  local: string;
  remote: string;

  getLocalFilePath(datadir: string): string {
    return datadir + this.cachedir + this.local;
  }

  getCacheDir(): string {
    return this.cachedir;
  }
}

export interface TaskData extends EventData,TTbl {
	//重复设定
  rtjson :RtJson;
  //提醒设定
  txjson :TxJson;
  //参与人
  members : Array<Member>;
  //发起人
  originator: Member;

  //附件
  fjs : Array<FjTbl>;

  //用于数据上传给服务器时，给哪些参与人，[]无参与人或参与人被全删
  tos : string;
}


export interface MiniTaskData extends EventData {
	//重复设定
  rtjson :RtJson;
  //提醒设定
  txjson :TxJson;
  //参与人
  members : Array<Member>;
  //发起人
  originator: Member;

  //附件
  fjs : Array<FjTbl>;

  //用于数据上传给服务器时，给哪些参与人，[]无参与人或参与人被全删
  tos : string;
}

export class RetParamEv{
  rtevi:string ="";
  sqlparam  = new  Array<any>();
  outAgdatas = new Array<AgendaData>();
}

export class RetParamTaskData {
  rtevi:string ="";
  sqlparam  = new  Array<any>();
  outTasks = new Array<TaskData>();
}

export class RetParamMiniTaskData {
  rtevi:string ="";
  sqlparam  = new  Array<any>();
  outTasks = new Array<MiniTaskData>();
}

export class RtOver {
  type: anyenum.OverType = anyenum.OverType.fornever;
  value: string;

  sameWith(another: RtOver): boolean {
    if (!another) return false;

    if (this.type != another.type) return false;
    if (this.type != anyenum.OverType.fornever && this.value != another.value) return false;

    return true;
  }

  text(): string {
    let text: string = "";

    switch(this.type) {
      case anyenum.OverType.times :
        assertEmpty(this.value);    // 结束条件不能为空
        assertNotNumber(this.value);   // 结束条件不能为数字字符串以外的值
        text = this.value + "次";
        break;
      case anyenum.OverType.limitdate :
        assertEmpty(this.value);    // 结束条件不能为空
        text = moment(this.value).format("YYYY年M月D日");
        break;
      case anyenum.OverType.fornever :
        text = "永远"
        break;
      default:
        assertFail();    // 预期外值, 程序异常
    }

    return text;
  }
}

export class RtJson {
  //重复类型
  cycletype: anyenum.CycleType = anyenum.CycleType.close;
  //重复周期（n天、n周、n月、n年）
  cyclenum: number = 1;//重复周期默认1, 不得小于1
  //开启方式：.一、二、三、四、五、六、日[0 - 6]
  openway: Array<number> = new Array<number>();

  //重复结束设定
  over: RtOver = new RtOver();

  sameWith(another: RtJson): boolean {
    if (!another) return false;

    if (this.cycletype != another.cycletype) return false;
    if (this.cyclenum != another.cyclenum) return false;

    let compare: Array<number> = this.openway.concat(another.openway);
    compare.sort((a, b) => a - b);

    if (compare.length % 2 != 0) return false;
    let last = compare.reduce((target, val) => {
      if (target == -1) {
        target = val;
      } else {
        if (target == val) {
          target = -1;
        } else {
          target = -99;
        }
      }

      return target;
    }, -1);

    if (last != -1) return false;

    if (this.over && another.over) {
      let oneover: RtOver = new RtOver();
      Object.assign(oneover, this.over);

      let anotherover: RtOver = new RtOver();
      Object.assign(anotherover, another.over);

      if (!(oneover.sameWith(anotherover))) return false;
    }

    if ((!this.over || !another.over) && (this.over || another.over)) return false;

    return true;
  }

  //重复设置文字说明
  text(): string {
    let text: string = "";

    let freqtitle = (cyclenum: number, title: string): string => {
      return (cyclenum > 1? cyclenum : "") + title;
    };

    let optiontitle = (openway: Array<number>, type: string, comma: string): string => {
      let text: string = "";

      // 选项不存在
      if (!openway || openway.length < 1) {
        return text;
      }

      switch(type) {
        case "周":
          let weekdays = openway.map((val) => {
            switch(val) {
              case 0:
                return "星期日";
              case 1:
                return "星期一";
              case 2:
                return "星期二";
              case 3:
                return "星期三";
              case 4:
                return "星期四";
              case 5:
                return "星期五";
              case 6:
                return "星期六";
              default:
                assertFail();    // 预期外值, 程序异常
            }
          });
          text = weekdays.join(", ") + comma;
          break;
        case "月":
          let monthdays = openway.map((val) => {
            return (val + 1) + "日";
          });
          text = monthdays.join(", ") + comma;
          break;
        default:
          assertFail();    // 预期外值, 程序异常
      }

      return text;
    };

    let overclass = new RtOver();
    Object.assign(overclass, this.over);

    switch(this.cycletype) {
      case anyenum.CycleType.day :
        text = "重复周期 " + freqtitle(this.cyclenum, "天") + ", " + overclass.text();
        break;
      case anyenum.CycleType.week :
        text = "重复周期 " + freqtitle(this.cyclenum, "周") + ", " + optiontitle(this.openway, "周", ", ") + overclass.text();
        break;
      case anyenum.CycleType.month :
        text = "重复周期 " + freqtitle(this.cyclenum, "月") + ", " + optiontitle(this.openway, "月", ", ") + overclass.text();
        break;
      case anyenum.CycleType.year :
        text = "重复周期 " + freqtitle(this.cyclenum, "年") + ", " + overclass.text();
        break;
      case anyenum.CycleType.close :    // 不重复日程
        text = "重复关闭。";
        break;
      default:
        assertFail();    // 预期外值, 程序异常
    }

    return text;
  }

  //遍历重复日期
  each(from: string, callback: (day: string) => void, withFrom: boolean = false) {
    // 开始日期
    let repeatStartDay: string = from;
    // 重复类型（天/周/月/年）
    let repeatType: moment.unitOfTime.DurationConstructor = "days";
    // 重复周期（n天/n周/n月/n年重复一次）
    let repeatStep: number = this.cyclenum || 1;
    // 开启方式（天（无）,周多选（一、二、三、四、五、六、日[0 - 6]）,月多选（1、2、...、31[0 - 30]）,年（无））
    let options: Array<number> = new Array<number>();
    // 结束条件（n次后结束、到某天结束、永远不结束（天（设置1年）、周（设置2年）、月（设置3年）、年（设置20年）））
    let repeatTimes: number;
    // 结束日期（指定结束日期时使用指定结束日期，否则使用计算出来的结束日期）
    let repeatEndDay: string = "";

    // 根据结束类型设置重复次数/结束日期
    switch(this.over.type) {
      case anyenum.OverType.times :
        assertEmpty(this.over.value);    // 结束条件不能为空
        assertNotNumber(this.over.value);   // 结束条件不能为数字字符串以外的值
        repeatTimes = (Number(this.over.value) > 0)? Number(this.over.value) : 1;
        break;
      case anyenum.OverType.limitdate :
        assertEmpty(this.over.value);    // 结束条件不能为空
        repeatEndDay = moment(this.over.value).add(1,'days').format("YYYY/MM/DD");
        break;
      case anyenum.OverType.fornever :
        break;
      default:
        assertFail();    // 预期外值, 程序异常
    }

    // 根据重复类型设置 重复类型/开启方式/重复次数/结束日期
    switch(this.cycletype) {
      case anyenum.CycleType.day :
        repeatType = "days";
        repeatTimes = repeatTimes || moment(repeatStartDay).add(1, "years").diff(repeatStartDay, "days");
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes * repeatStep, "days").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.week :
        repeatType = "weeks";
        options = this.openway || options;
        repeatTimes = repeatTimes || moment(repeatStartDay).add(2, "years").diff(repeatStartDay, "weeks");
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes * repeatStep, "weeks").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.month :
        repeatType = "months";
        options = this.openway || options;
        repeatTimes = repeatTimes || moment(repeatStartDay).add(3, "years").diff(repeatStartDay, "months");
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes * repeatStep, "months").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.year :
        repeatType = "years";
        repeatTimes = repeatTimes || 20;
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes * repeatStep, "years").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.close :    // 不重复日程
        repeatType = "days";
        repeatTimes = 1;
        repeatEndDay = moment(repeatStartDay).add(1, "days").format("YYYY/MM/DD");
        break;
      default:
        assertFail();    // 预期外值, 程序异常
    }

    let stepDay: string = repeatStartDay;

    // 循环开始日期 ~ 结束日期
    while (moment(stepDay).isBefore(repeatEndDay)) {

      let days: Array<string> = new Array<string>();

      if (options.length > 0) {
        // 星期多选/每月日期多选
        if (repeatType == "weeks") {
          let dayOfWeek: number = Number(moment(stepDay).format("d"));

          for (let option of options) {
            let duration: number = option - dayOfWeek;

            if (duration == 0) {
              days.push(stepDay);     // 当前日期为重复日期
            } else if (duration > 0) {
              //当周日期
              days.push(moment(stepDay).add(duration, "days").format("YYYY/MM/DD"));
            } else {
              //下周日期（跨周）
              days.push(moment(stepDay).add(7, "days").subtract(Math.abs(duration), "days").format("YYYY/MM/DD"));
            }
          }

        } else if (repeatType == "months") {
          let dayOfMonth: number = Number(moment(stepDay).format("D")) - 1;   // 0 - 30 和options设置日期匹配
          let maxDayOfMonth: number = moment().daysInMonth();

          for (let option of options) {

            // 当月没有这一天
            if (option > maxDayOfMonth) {
              continue;
            }

            let duration: number = option - dayOfMonth;

            if (duration == 0) {
              days.push(stepDay);     // 当前日期为重复日期
            } else if (duration > 0) {
              //当月日期
              days.push(moment(stepDay).add(duration, "days").format("YYYY/MM/DD"));
            } else {
              //下月日期（跨月）
              days.push(moment(stepDay).add(1, "months").dates(option + 1).format("YYYY/MM/DD"));
            }
          }

        } else {
          assertFail();    // 预期外值, 程序异常
        }
      } else {
        // 普通重复
        days.push(stepDay);
      }

      // 增加创建当天是否需要添加此事件
      if (withFrom && stepDay == repeatStartDay) {
        if (days.length > 0 && days.indexOf(from) < 0) {
          days.unshift(from);
        }
      }

      days.sort((a, b) => {
        return moment(a).valueOf() - moment(b).valueOf();
      });

      for (let day of days) {
        if (moment(day).isBefore(repeatEndDay)) {
          callback(day);
        }
      }

      stepDay = moment(stepDay).add(repeatStep, repeatType).format("YYYY/MM/DD");
    }
  }
}

export class TxJson {
  close: boolean = false;   // 2019/10/22 增加提醒关闭属性，用于保留提醒设置内容，但是不提醒
  reminds: Array<number> = new Array<number>();

  static caption(minutes: number): string {
    let humanremind: string = moment.duration(minutes, "minutes").humanize();

    if (minutes > 0) {
      return `提前${humanremind}提醒`;
    } else if (minutes < 0) {
      return `延后${humanremind}提醒`;
    } else {
      return `事件开始时提醒`;
    }
  }

  text(first: boolean = true): string {
    this.reminds.sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });

    if (this.reminds && this.reminds.length > 0) {
      let humanremind: string = moment.duration(this.reminds[0], "minutes").humanize();
      if (first && this.reminds[0] > 0) return `提前${humanremind}提醒`;
      if (first && this.reminds[0] < 0) return `延后${humanremind}提醒`;
      if (first && this.reminds[0] == 0) return `事件开始时提醒`;
    } else {
      return "";
    }
  }

  sameWith(another: TxJson): boolean {
    if (!another) return false;

    let compare: Array<number> = this.reminds.concat(another.reminds);
    compare.sort((a, b) => a - b);

    if (compare.length % 2 != 0) return false;
    let last = compare.reduce((target, val) => {
      if (target == -1) {
        target = val;
      } else {
        if (target == val) {
          target = -1;
        } else {
          target = -99;
        }
      }

      return target;
    }, -1);

    if (last == -1) {
      return true;
    } else {
      return false;
    }
  }

  // 遍历计算每个提醒的实际时间
  each(sd: string, st: string, callback: (datetime: number) => void) {
    // 如果提醒关闭或者没有提醒数据，直接返回
    if (this.close || !this.reminds || this.reminds.length <= 0) {
      return;
    }

    for (let remind of this.reminds) {
      let baseline = moment(sd + " " + st, "YYYY/MM/DD HH:mm");
      baseline.subtract(remind, "m");

      callback(baseline.valueOf());
    }
  }
}

//处理类型
export enum DoType {
  Local = "Local",
  Current = "Current",
  FutureAll = "FutureAll",
  All = "All",
  Invite = "Invite",
}

enum FieldChanged{
  Ji = "Ji",
  Member = "Member",
  Invite = "Invite",
  Todolist = 'Todolist'
}
enum DUflag {
  del = "del",
  update = "update"
}

export function isJsonString(str: string) {
  try {
    JSON.parse(str)
  } catch(e) {
    return false;
  }
  return true;
}

export function generateCacheFilePathJson(fpjson: CacheFilePathJson, fj: string) {
  if (!fpjson) {
    if (fj && isJsonString(fj)) {
      fpjson = new CacheFilePathJson();
      Object.assign(fpjson, JSON.parse(fj));
    } else {
      return null;
    }
  } else {
    let newfpjson: CacheFilePathJson = new CacheFilePathJson();
    Object.assign(newfpjson, fpjson);
    fpjson = newfpjson;
  }

  return fpjson;
}

export function generateRtJson(rtjson: RtJson, rt: string) {
  if (!rtjson) {
    if (rt) {
      rtjson = new RtJson();
      Object.assign(rtjson, JSON.parse(rt));
    } else {
      rtjson = new RtJson();
    }
  } else {
    let newrtjson: RtJson = new RtJson();
    Object.assign(newrtjson, rtjson);
    rtjson = newrtjson;
  }

  return rtjson;
}

export function generateTxJson(txjson: TxJson, tx: string) {
  if (!txjson) {
    if (tx) {
      txjson = new TxJson();
      Object.assign(txjson, JSON.parse(tx));
    } else {
      txjson = new TxJson();
    }
  } else {
    let newtxjson: TxJson = new TxJson();
    Object.assign(newtxjson, txjson);
    txjson = newtxjson;
  }

  return txjson;
}
/**
* 附件内容接口
*/
export interface FjData extends FjTbl {

}
