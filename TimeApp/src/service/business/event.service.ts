import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EvTbl } from "../sqlite/tbl/ev.tbl";
import { TTbl } from "../sqlite/tbl/t.tbl";
import { CaTbl } from "../sqlite/tbl/ca.tbl";
import {ScdData} from "../../data.mapping";
import {UserConfig} from "../config/user.config";
import {CTbl} from "../sqlite/tbl/c.tbl";
import {AgdPro} from "../restful/agdsev";
import {SpTbl} from "../sqlite/tbl/sp.tbl";
import * as moment from "moment";
import {ETbl} from "../sqlite/tbl/e.tbl";

@Injectable()
export class EventService extends BaseService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService) {
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
        if(agdata.ed==''){
          agdata.ed = agdata.sd;
        }
        if(agdata.et==''){
          agdata.et = agdata.st;
        }

        agdata.ui = UserConfig.account.id;

        //事件sqlparam 及提醒sqlparam
        let retParamEv = new RetParamEv();
        retParamEv = this.sqlparamAddEv(agdata);
        let agdparam = new Array<any>();
        agdparam = this.sqlparamAddAdg(retParamEv.rtevi,retParamEv.ed,agdata);
        retParamEv.sqlparam.push(agdparam);

        await this.sqlExce.batExecSqlByParam(retParamEv.sqlparam);

        let adgPro: AgdPro = new AgdPro();
     /*   //restFul保存日程
        this.setAdgPro(adgPro, ct);
        // 语音创建的时候，如果不同步，会导致服务器还没有保存完日程，保存联系人的请求就来了，导致查不到日程无法触发共享联系人动作
        // 必须增加await，否则，页面创建和语音创建方法必须分开
        await this.agdRest.save(adgPro);

        Object.assign(rc,ct);
        resolve(rc);

        this.emitService.emitRef(ct.sd);*/
      }
    })
  }

  /**
   * 事件新增sql list
   * @param {AgendaData} evdata 事件
   * @returns {RetParamEv}
   */
  private sqlparamAddEv(agdata : AgendaData ): RetParamEv{
    let ret = new RetParamEv();
    let len = 1;
    let add: any = 'd';
    if (agdata.rt == '1') {
      len = 365;
    } else if (agdata.rt == '2') {
      len = 96;
      add = 'w';
    } else if (agdata.rt == '3') {
      len = 24;
      add = 'M';
    } else if (agdata.rt == '4') {
      len = 20;
      add = 'y';
    }

    for (let i = 0; i < len; i++) {
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
      ev.type = EventType.Agenda;
      ev.tx = agdata.tx;
      ev.txs = agdata.txs;
      ev.rt = agdata.rt;
      ev.rts = agdata.rts;
      ev.fj = agdata.fj;
      ev.pn = agdata.pn;
      ev.md = agdata.md;
      ev.iv = agdata.iv;
      ev.sr = "";
      ev.gs = '0' ;
      ret.ed = ev.evd;
      ret.sqlparam.push(ev.rpTParam());
      if (ev.tx > '0') {
        ret.sqlparam.push(this.sqlparamAddTxE(ev,agdata.st,agdata.sd).rpT());
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
  private sqlparamAddTxE(ev: EvTbl,st:string ,sd:string): ETbl {
    let et = new ETbl();//提醒表
    et.si = ev.evi;
    et.wi = ev.evi;
    if (ev.tx != '0') {
      et.st = ev.evn;
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
      et.wd = moment(date).format("YYYY/MM/DD");
      et.wt = moment(date).format("HH:mm");
      console.log('-------- 插入提醒表 --------');

    }

    return et;
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

    ca.ed = ed;
    ca.et = ca.st;

    //保存本地日程
    if (!ca.st) ca.st = this.util.adToDb("");

    return ca.rpTParam();
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

export enum EventType {
  Agenda = "0",
  Task = "1",
  MiniTask = "2"
}
