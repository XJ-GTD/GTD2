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
import * as anyenum from "../../data.enum";
import {R} from "../../ws/model/ws.enum";
import {OpenWay} from "../../data.enum";

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
  async saveAgenda(agdata : AgendaData): Promise<AgendaData> {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    if (agdata.evi !=null && agdata.evi != "") {
      console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
      return null;
    }else{
      console.log("ccccccccccccccccccccccccccccccc");

      //设置页面参数初始化
      this.initAgdParam(agdata);
      console.log(JSON.stringify(agdata));

      //事件sqlparam 及提醒sqlparam
      let retParamEv = new RetParamEv();
      retParamEv = this.sqlparamAddEv(agdata);
      console.log(JSON.stringify(retParamEv));

      //日程表sqlparam
      let agdparam = new Array<any>();
      agdparam = this.sqlparamAddAdg(retParamEv.rtevi,retParamEv.ed,agdata);
      console.log(JSON.stringify(agdparam));

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
      console.log(JSON.stringify(rst));

      //如果网络正常提交到服务器，则更新同步标志
      if (rst !=  -1){
        let sq =`update gtd_ev set wtt = ${moment().unix()} , tb = '${anyenum.SyncType.synch}'
        where rtevi = '${retParamEv.rtevi}' ;`;

        await  this.sqlExce.execSql(sq);
      }

      this.emitService.emitRef(agdata.sd);
      console.log(agdata);

      return agdata;
    }
  }

  /**
   * 初始化页面参数
   * @param {AgendaData} agdata
   */
  private initAgdParam(agdata : AgendaData){


    agdata.ui = UserConfig.account.id;
    agdata.mi = (!agdata.mi || agdata.mi =="")? UserConfig.account.id : agdata.mi;
    agdata.rtevi = !agdata.rtevi ? "" : agdata.rtevi ;
    agdata.ji = !agdata.ji ?  "" : agdata.ji;
    agdata.bz = !agdata.bz ? "" : agdata.bz ;
    agdata.type = !agdata.type ? anyenum.ObjectType.Calendar : agdata.type ;

    let txjson = new TxJson();
    txjson.type = anyenum.TxType.close;
    txjson.defvalue = 0;
    agdata.tx = !agdata.tx ? JSON.stringify(txjson) : agdata.tx ;

    agdata.txs = !agdata.txs ? "" : agdata.txs ;

    let rtjon = new RtJson();
    rtjon.cycletype = anyenum.CycleType.close;
    rtjon.over.value = "";
    rtjon.over.type = anyenum.OverType.fornever;
    rtjon.cyclenum = 0;
    rtjon.openway = anyenum.OpenWay.close;
    agdata.rt = !agdata.rt ? JSON.stringify(rtjon) : agdata.rt ;

    agdata.rts = !agdata.rts ? "" : agdata.rts ;


    agdata.fj = !agdata.fj ? "" : agdata.fj ;
    agdata.pn = !agdata.pn ? 0 : agdata.pn ;
    agdata.md = !agdata.md ? anyenum.ModiPower.disable : agdata.md ;
    agdata.iv = !agdata.iv ? anyenum.InvitePowr.disable : agdata.iv ;
    agdata.sr = !agdata.sr ? "" : agdata.sr ;
    agdata.gs = !agdata.gs ? "" : agdata.gs ;
    agdata.tb = !agdata.tb ? anyenum.SyncType.unsynch : agdata.tb ;
    agdata.del = !agdata.del ? anyenum.DelType.undel : agdata.del ;
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

    //重复周期数
    let len :number = 1;

    //重复类型
    let addtype: any ;

    //重复结束日
    let repeatEnddt :any;

    //重复开始日
    let repeatStartdt :any;

    //计算开始日，结束日及设定重复区间、重复单位
    if (agdata.rtjson.cycletype == anyenum.CycleType.d) {

      len = agdata.rtjson.cyclenum;
      repeatStartdt = this.getRepeatStartDt(agdata.sd,null);
      repeatEnddt = moment(repeatStartdt).add(len, 'd');

      addtype = 'd';
    }else if (agdata.rtjson.cycletype == anyenum.CycleType.w) {

      len = agdata.rtjson.cyclenum;
      repeatStartdt = this.getRepeatStartDt(agdata.sd,agdata.rtjson.openway);
      repeatEnddt = moment(repeatStartdt).add(len , 'w');

      addtype = 'w';
    } else if (agdata.rtjson.cycletype == anyenum.CycleType.m) {


      len = agdata.rtjson.cyclenum;
      repeatStartdt = this.getRepeatStartDt(agdata.sd,agdata.rtjson.openway);
      repeatEnddt = moment(repeatStartdt).add(len , 'M');

      if (agdata.rtjson.openway == anyenum.OpenWay.close){
        addtype = 'M';
      }else{
        addtype = 'w';
      }

    } else if (agdata.rtjson.cycletype == anyenum.CycleType.y) {
      len = agdata.rtjson.cyclenum;
      repeatStartdt =  this.getRepeatStartDt(agdata.sd,null);
      repeatEnddt = moment(repeatStartdt).add(len , 'y');

      addtype = 'y';
    }else {
      repeatStartdt = this.getRepeatStartDt(agdata.sd,null);
      repeatEnddt = repeatStartdt;
      addtype = 'd';
    }

    let limitvalue ;
    if (agdata.rtjson.over.type == anyenum.OverType.times){
      limitvalue = parseInt(agdata.rtjson.over.value);
    }else if(agdata.rtjson.over.type == anyenum.OverType.limitdate){
      limitvalue = moment(agdata.rtjson.over.value).unix();
    }else{
      limitvalue = 99999999999999;
    }

    let rt  = JSON.stringify(agdata.rtjson);
    let tx  = JSON.stringify(agdata.txjson);

    //循环变量初始化
    let loopdt = repeatStartdt;
    let cnt :number= 0;
    //repeatEnddt + 1天表示 repeatEnddt 是有效日期
    let loopenddt = moment(repeatEnddt).add(1,'d');

    while (moment(loopdt).isBefore(loopenddt)){

      let ev = new EvTbl();
      ev.evi = this.util.getUuid();
      if ( cnt == 0 ){
        ret.rtevi = ev.evi;
      }
      ev.evn = agdata.evn;
      ev.ui = agdata.ui;
      ev.mi = agdata.mi;

      ev.evd = moment(loopdt).format("YYYY/MM/DD");

      //满足结束条件，直接跳出循环
      if (cnt > limitvalue || moment(ev.evd).unix() > limitvalue){
        break;
      }

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
      if (agdata.txjson.type != anyenum.TxType.close) {
        ret.sqlparam.push(this.sqlparamAddTxWa(ev,agdata.st,agdata.txjson).rpTParam());
      }

      cnt = cnt + 1;
      loopdt = moment(repeatStartdt).add(cnt,addtype);

    }

    return ret;
  }

  private getRepeatStartDt(sd :string, openway :anyenum.OpenWay):string {

    if (openway == null || openway == anyenum.OpenWay.close){
      return sd ;
    }else{

      for (let i = 0 ; i < 7; i++){
        let weekday  = moment(sd).add(i,'d');
        if (weekday.day() == 0 && openway == anyenum.OpenWay.Sunday){
          return weekday.format('YYYY/MM/DD');
        }
        if (weekday.day() == 1 && openway == anyenum.OpenWay.Monday){
          return weekday.format('YYYY/MM/DD');
        }
        if (weekday.day() == 2 && openway == anyenum.OpenWay.Tuesday){
          return weekday.format('YYYY/MM/DD');
        }
        if (weekday.day() == 3 && openway == anyenum.OpenWay.Wednesday){
          return weekday.format('YYYY/MM/DD');
        }
        if (weekday.day() == 4 && openway == anyenum.OpenWay.Thursday){
          return weekday.format('YYYY/MM/DD');
        }
        if (weekday.day() == 5 && openway == anyenum.OpenWay.Friday){
          return weekday.format('YYYY/MM/DD');
        }
        if (weekday.day() == 6 && openway == anyenum.OpenWay.Saturday){
          return weekday.format('YYYY/MM/DD');
        }

      }

      return sd;
    }

  }

  /**
   *获取提醒表sql
   * @param {EvTbl}
   * @param {ev: EvTbl,st:string ,sd:string,txjson :TxJson }
   * @returns {ETbl}
   */
  private sqlparamAddTxWa(ev: EvTbl,st:string,txjson :TxJson ): WaTbl {
    let wa = new WaTbl();//提醒表
    wa.wai = this.util.getUuid();
    wa.obt = anyenum.ObjectType.Event;
    //todo tx需要解析
    //let tx  = ;
    if (txjson.type != anyenum.TxType.close) {
      wa.st = ev.evn;
      let time = 10; //分钟
      if (txjson.type == anyenum.TxType.m10) {
        time = 10;
      }else if (txjson.type == anyenum.TxType.m30) {
        time = 30;
      } else if (txjson.type == anyenum.TxType.h1) {
        time = 60;
      } else if (txjson.type == anyenum.TxType.h4) {
        time = 240;
      } else if (txjson.type == anyenum.TxType.d1) {
        time = 1440;
      }else {
        time = txjson.defvalue;
      }
      let date;
      if (!this.util.isAday(st)) {
        date = moment(ev.evd + " " + st).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

      } else {
        date = moment(ev.evd + " " + "08:00").subtract(time, 'm').format("YYYY/MM/DD HH:mm");

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

	/**
	 * 创建更新任务
	 * @author ying<343253410@qq.com>
	 */
  async saveTask(tx: TaskData): Promise <TaskData> {
		this.assertEmpty(tx); // 对象不能为空
		this.assertEmpty(tx.evn); // 事件主题不能为空
		if(tx.evi) {
			//更新任务事件
			let evdb: EvTbl = new EvTbl();
			tx.mi = UserConfig.account.id; //更新者
			Object.assign(evdb, tx);
		  await this.sqlExce.updateByParam(evdb);
			let ttdb: TTbl = new TTbl();
			//根据主键ID获取任务详情
			ttdb.evi = tx.evi;
			ttdb = await this.sqlExce.getOneByParam<TTbl>(ttdb);
			Object.assign(ttdb, tx);
			await this.sqlExce.updateByParam(ttdb);
		} else {
			//创建事件
			tx.evi = this.util.getUuid();
			tx.ui= UserConfig.account.id;
			tx.type=anyenum.EventType.Task;
			tx.evd=moment().format('YYYY/MM/DD');
			tx.gs=anyenum.GsType.self;
			tx.tb=anyenum.SyncType.unsynch;
			tx.del=anyenum.DelType.undel;
			let evdb: EvTbl = new EvTbl();
			Object.assign(evdb, tx);
			await this.sqlExce.saveByParam(evdb);
			//创建任务
			let ttdb: TTbl = new TTbl();
			ttdb.evi = tx.evi;
			Object.assign(ttdb, tx);
			await this.sqlExce.saveByParam(ttdb);
		}
		return tx;
  }

  /**
	 * 创建更新小任务
	 * @author ying<343253410@qq.com>
	 */
  async saveMiniTask(minitask: MiniTaskData): Promise <MiniTaskData>{
  	this.assertEmpty(minitask); // 对象不能为空
  	this.assertEmpty(minitask.evn);
  	if (minitask.evi) {
			let evdb: EvTbl = new EvTbl();
			Object.assign(evdb, minitask);
			await this.sqlExce.updateByParam(evdb);
		} else {
			minitask.evi = this.util.getUuid();
			minitask.ui= UserConfig.account.id;
			minitask.type=anyenum.EventType.MiniTask;
			minitask.evd=moment().format('YYYY/MM/DD');
			minitask.gs=anyenum.GsType.self;
			minitask.tb=anyenum.SyncType.unsynch;
			minitask.del=anyenum.DelType.undel;
			let evdb: EvTbl = new EvTbl();
			Object.assign(evdb, minitask);
			await this.sqlExce.saveByParam(evdb);
		}
		return minitask;
  }

  updateEventPlan() {}
  updateEventRemind() {}
  updateEventRepeat() {}
  removeEvent() {}

  /**
	 * 完成任务
	 * @author ying<343253410@qq.com>
	 */
  async finishTask(evi: string):  Promise <string>{
  	this.assertEmpty(evi); // 事件ID不能为空
  	let tdb: TTbl = new TTbl();
		tdb.evi = evi;
		tdb.cs=anyenum.IsSuccess.success;
		tdb.fd=moment().format('YYYY/MM/DD');
		await this.sqlExce.updateByParam(tdb);
		//TODO 是否推送事件完成消息
		//this.emitService.emit(`mwxing.event.task.finish`);
		return tdb.isrt;
  }

  /**
   * 当是自动创建的任务的情况下,进行下一步操作
   * @author ying<343253410@qq.com>
   */
  async finishTaskNext(evi: string){
  	this.assertEmpty(evi);
  	let evdb: EvTbl = new EvTbl();
		evdb.evi = evi;
		evdb = await this.sqlExce.getOneByParam<EvTbl>(evdb);
		if (evdb.type != anyenum.EventType.Task) {
			throw new Error("非任务类型,无法自动创建");
		}
  	let tdb: TTbl = new TTbl();
		tdb.evi = evi;
		tdb =	await this.sqlExce.getOneByParam<TTbl>(tdb);
		if (tdb.isrt == anyenum.IsCreate.isYes) {
			//创建新的任务事件
			let tx:TaskData = {} as TaskData;
			evdb.rtevi = evi;
			evdb.evi = "";
			Object.assign(tx, evdb);
			tx.cs = anyenum.IsSuccess.wait;
			tx.isrt = anyenum.IsCreate.isYes;
			this.saveTask(tx);
		}
		return ;
  }

  sendEvent() {}
  receivedEvent() {}
  acceptReceivedEvent() {}
  rejectReceivedEvent() {}
  syncEvent() {}
  syncEvents() {}

  /**
	 * 检索任务
	 * @author ying<343253410@qq.com>
	 */
  fetchPagedTasks() {}

  /**
	 * 检索完成任务
	 * @author ying<343253410@qq.com>
	 */
  fetchPagedCompletedTasks() {}

  /**
	 * 检索未完成的任务
	 * @author ying<343253410@qq.com>
	 */
  fetchPagedUncompletedTasks() {}

  /**
   * 备份,三张表备份
	 * @author ying<343253410@qq.com>
   */
  backup() {}

  /**
   * 恢复
	 * @author ying<343253410@qq.com>
   */
  recovery() {}
}

export interface EventData extends EvTbl {

}

export interface AgendaData extends EventData, CaTbl {
  rtjson :RtJson;
  txjson :TxJson;

}

export interface TaskData extends EventData,TTbl {

}


export interface MiniTaskData extends EventData {

}

export class RetParamEv{
  rtevi:string ="";
  ed:string = "";
  sqlparam  = new  Array<any>();
}

export class RtOver {
  type:anyenum.OverType;
  value:string;
}

export class RtJson {
  cycletype:anyenum.CycleType;
  cyclenum:number;
  openway:anyenum.OpenWay;
  over: RtOver = new RtOver();
}

export class TxJson {
  type: anyenum.TxType;
  defvalue:number;
}
