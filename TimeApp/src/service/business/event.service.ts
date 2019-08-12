import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EvTbl } from "../sqlite/tbl/ev.tbl";
import { TTbl } from "../sqlite/tbl/t.tbl";
import { CaTbl } from "../sqlite/tbl/ca.tbl";
import {UserConfig} from "../config/user.config";
import {AgdPro, AgdRestful} from "../restful/agdsev";
import * as moment from "moment";
import {ETbl} from "../sqlite/tbl/e.tbl";
import {EmitService} from "../util-service/emit.service";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import anyenum, {CycleType, WeekType} from "../../data.enum";

@Injectable()
export class EventService extends BaseService {
  constructor(private sqlExce: SqliteExec, private util: UtilService,
              private agdRest: AgdRestful,private emitService:EmitService) {
    super();
  }

  /**
   * 保存日程
   * @param {AgendaData} agdata
   * @returns {Promise<AgendaData>}
   */
  saveAgenda(agdata : AgendaData) :Promise<AgendaData> {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    return new Promise<AgendaData>(async (resolve, reject) => {

      if (agdata.evi !=null && agdata.evi != ""){

      }else{
        agdata.ui = UserConfig.account.id;

        //事件sqlparam 及提醒sqlparam
        let retParamEv = new RetParamEv();
        retParamEv = this.sqlparamAddEv(agdata);

        //日程表sqlparam
        let agdparam = new Array<any>();
        agdparam = this.sqlparamAddAdg(retParamEv.rtevi,retParamEv.ed,agdata);

        //批量本地入库
        let sqlparam = new Array<any>();
        sqlparam = [...retParamEv.sqlparam, ...agdparam];
        await this.sqlExce.batExecSqlByParam(sqlparam);

        //提交服务器
        let agdPro: AgdPro = new AgdPro();
        //restFul保存事件日程
        this.setAgdPro(agdPro, agdata,retParamEv.rtevi);
        // 语音创建的时候，如果不同步，会导致服务器还没有保存完日程，保存联系人的请求就来了，导致查不到日程无法触发共享联系人动作
        // 必须增加await，否则，页面创建和语音创建方法必须分开
        let rst = await this.agdRest.save(agdPro);

        //如果网络正常提交到服务器，则更新同步标志
        if (rst !=  -1){
          let sq =`update gtd_ev set wtt = ${moment().unix()} , tb = ${anyenum.SyncType.synch} 
          where rtevi = ${retParamEv.rtevi} ;`;

          await  this.sqlExce.execSql(sq);
        }

        this.emitService.emitRef(agdata.sd);

        resolve(agdata);

      }
    })
  }

  /**
   * 新增接口restful参数设置
   * @param {AgdPro} agd
   * @param {AgendaData} agdata
   * @param {string} rtevi
   */
  private setAgdPro(agd: AgdPro, agdata : AgendaData, rtevi : string ) {
    //关联日程ID
    agd.rai = agdata.sr;
    //日程发送人用户ID
    agd.fc = agdata.ui;
    //日程ID
    agd.ai = rtevi;
    //主题
    agd.at = agdata.evn;
    //时间(YYYY/MM/DD)
    agd.adt = agdata.sd;
    agd.st = agdata.st;
    agd.ed = agdata.ed;
    agd.et = agdata.et;
    //计划
    agd.ap = agdata.ji;
    //重复
    agd.ar = agdata.rt;
    //提醒
    agd.aa = agdata.tx;
    //备注
    agd.am = agdata.bz;
  }

  /**
   * 事件新增sql list
   * @param {AgendaData} evdata 事件
   * @returns {RetParamEv}
   */
  private sqlparamAddEv(agdata : AgendaData): RetParamEv{
    let ret = new RetParamEv();
    let len :Number= 1;
    let add: any = 'd';
    // rt需要解析
    if (agdata.rtjson.cycletype == anyenum.CycleType.d) {
      add = 'd';
      len = agdata.rtjson.cyclenum;
    } else if (agdata.rtjson.cycletype == anyenum.CycleType.w) {
      add = 'w';
      len = agdata.rtjson.cyclenum;
    } else if (agdata.rtjson.cycletype == anyenum.CycleType.m) {

      add = 'M';
      len = agdata.rtjson.cyclenum;
    } else if (agdata.rtjson.cycletype == anyenum.CycleType.y) {

      add = 'y';
    }else {
      add = 'd';
      len = 1;
    }

    if (agdata.rtjson.openway){

    }

    let limitvalue = 99999999999999;
    if (agdata.rtjson.over.type == anyenum.OverType.times){
      limitvalue = parseInt(agdata.rtjson.over.value);
    }else if(agdata.rtjson.over.type == anyenum.OverType.limitdate){
      limitvalue = moment(agdata.rtjson.over.value).unix();
    }

    let rt  = JSON.stringify(agdata.rtjson);
    let tx  = JSON.stringify(agdata.txjson);
    let cnt = 0;
    for (let i = 0; i < len; i++) {
      cnt = cnt + 1;
      let ev = new EvTbl();
      ev.evi = this.util.getUuid();
      if (i == 0 ){
        ret.rtevi = ev.evi;
      }
      ev.evn = agdata.evn;
      ev.ui = agdata.ui;
      ev.mi = agdata.mi;
      ev.evd = moment(agdata.sd).add(i, add).format("YYYY/MM/DD");
      ev.rtevi = ret.rtevi;
      ev.ji = agdata.ji;
      ev.bz = agdata.bz;
      ev.type = anyenum.EventType.Agenda;
      ev.tx = tx;
      ev.txs = agdata.txs;
      ev.rt = rt;
      ev.rts = agdata.rts;
      ev.fj = agdata.fj;
      ev.pn = agdata.pn;
      ev.md = agdata.md;
      ev.iv = agdata.iv;
      ev.sr = agdata.sr;
      ev.gs = anyenum.GsType.self ;
      ev.tb = anyenum.SyncType.unsynch;
      ev.del = anyenum.DelType.undel;
      ret.ed = ev.evd;
      ret.sqlparam.push(ev.rpTParam());
      if (ev.tx > '0') {
        ret.sqlparam.push(this.sqlparamAddTxWa(ev,agdata.st,agdata.sd).rpTParam());
      }

      if (cnt > limitvalue || moment(ev.evd).unix() > limitvalue){
        break;
      }
    }
    return ret;
  }

  /**
   *获取提醒表sql
   * @param {EvTbl}
   * @param {ev: EvTbl,st:string ,sd:string}
   * @returns {ETbl}
   */
  private sqlparamAddTxWa(ev: EvTbl,st:string ,sd:string): WaTbl {
    let wa = new WaTbl();//提醒表
    wa.wai = this.util.getUuid();
    wa.obt = anyenum.ObType.event;
    //todo tx需要解析
    //let tx  = ;
    if (ev.tx != '0') {
      wa.st = ev.evn;
      let time = 10; //分钟
      if (ev.tx == "2") {
        time = 30;
      } else if (ev.tx == "3") {
        time = 60;
      } else if (ev.tx == "4") {
        time = 240;
      } else if (ev.tx == "5") {
        time = 1440;
      }
      let date;
      if (!this.util.isAday(st)) {
        date = moment(sd + " " + st).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

      } else {
        date = moment(sd + " " + "08:00").subtract(time, 'm').format("YYYY/MM/DD HH:mm");

      }
      wa.wd = moment(date).format("YYYY/MM/DD");
      wa.wt = moment(date).format("HH:mm");
      console.log('-------- 插入提醒表 --------');

    }

    return wa;
  }

  /**
   * 日程新增sql list
   * @param {AgendaData} rc 日程信息
   * @returns {Array<any>}
   */
  private sqlparamAddAdg(rtevi : string,ed :string, agdata : AgendaData): Array<any> {

    let ca = new CaTbl();
    ca.evi = rtevi;

    ca.sd = agdata.sd;
    ca.st = agdata.st;
    ca.ct = agdata.ct;
    ca.et = agdata.et;

    ca.ed = ed;

    if(ca.ed==''){
      ca.ed = ca.sd;
    }
    if(ca.et==''){
      ca.et = ca.st;
    }
    //保存本地日程
    if (!ca.st) ca.st = this.util.adToDb("");

    let ret = new Array<any>();
    ret.push(ca.rpTParam());
    return ret;
  }

  saveTask(){

  }
  saveMiniTask() {}
  updateEventPlan() {}
  updateEventRemind() {}
  updateEventRepeat() {}
  removeEvent() {}
  finishTask() {}
  sendEvent() {}
  receivedEvent() {}
  acceptReceivedEvent() {}
  rejectReceivedEvent() {}
  syncEvent() {}
  syncEvents() {}
  fetchPagedTasks() {}
  fetchPagedCompletedTasks() {}
  fetchPagedUncompletedTasks() {}
  backup() {}
  recovery() {}
}

export interface EventData extends EvTbl {

}

export interface AgendaData extends EventData, CaTbl {
  rtjson :RtJson;
  txjson :TxJson;

}

export interface TaskData extends EventData, TTbl {

}

export interface MiniTaskData extends EventData {

}

class RetParamEv{
  rtevi:string ="";
  ed:string = "";
  sqlparam  = new  Array<any>();
}

export class RtJson {
  cycletype:anyenum.CycleType;
  cyclenum:Number;
  openway:WeekType;
  over:{
    type:anyenum.OverType,
    value:string
  }
}

export class TxJson {
  tx :string
}

