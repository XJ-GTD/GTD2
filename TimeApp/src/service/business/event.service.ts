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
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import {ScdData, SpecScdData} from "../../data.mapping";

@Injectable()
export class EventService extends BaseService {
  constructor(private sqlExce: SqliteExec, private util: UtilService,
              private agdRest: AgdRestful,private emitService:EmitService,private bacRestful: BacRestful) {
    super();
  }

  /**
   * 页面判断重复设置是否改变
   * @param {AgendaData} newAgd
   * @param {AgendaData} oldAgd
   * @returns {boolean}
   */
  isAgdChanged(newAgd : AgendaData ,oldAgd : AgendaData): boolean{
    //重复选项发生变化
    if (newAgd.rtjson.cycletype != oldAgd.rtjson.cycletype){
      return true;
    }
    if (newAgd.rtjson.cyclenum != oldAgd.rtjson.cyclenum){
      return true;
    }
    if (newAgd.rtjson.openway != oldAgd.rtjson.openway){
      return true;
    }
    if (newAgd.rtjson.over.type != oldAgd.rtjson.over.type){
      return true;
    }
    if (newAgd.rtjson.over.value != oldAgd.rtjson.over.value){
      return true;
    }

    //title发生变化
    if (newAgd.evn != oldAgd.evn){
      return true;
    }
    //开始日发生变化
    if (newAgd.sd != oldAgd.sd){
      return true;
    }
    //开始时间发生变化
    if (newAgd.st != oldAgd.st){
      return true;
    }
    //全天条件发生变化
    if (newAgd.al != oldAgd.al){
      return true;
    }

    //时长发生变化
    if (newAgd.ct != oldAgd.ct){
      return true;
    }
    return false;
  }

  /**
   * 保存日程
   * @param {AgendaData} agdata
   * @param {ModifyType} modiType
   * 修改非重复日程to非重复日程、重复日程中的某一日程to非重复日程使用ModifyType.OnlySel，
   * 修改重复日程to重复日程、非重复日程to重复日程使用ModifyType.FromSel，
   * 新建日程使用 ModifyType.Non
   * @returns {Promise<AgendaData>}
   */
  async saveAgenda(agdata : AgendaData, modiType : anyenum.ModifyType = anyenum.ModifyType.Non): Promise<Array<AgendaData>> {
    // 入参不能为空
    this.assertEmpty(agdata);
    this.assertEmpty(agdata.sd);    // 日程开始日期不能为空
    this.assertEmpty(agdata.evn);   // 日程标题不能为空

    // 新建日程
    if (!agdata.evi || agdata.evi == "") {
      if (agdata.rtjson || agdata.rt || agdata.rts) {
        this.assertEmpty(agdata.rtjson);  // 新建重复日程不能为空
      } else {
        agdata.rtjson = new RtJson();
      }

      if (agdata.txjson || agdata.tx || agdata.txs) {
        this.assertEmpty(agdata.txjson);  // 新建日程提醒不能为空
      } else {
        agdata.txjson = new TxJson();
      }
    }

    if (agdata.evi != null && agdata.evi != "") {
      /*修改*/
      let outAgdatas = await this.updateAgenda(agdata,modiType);

      return outAgdatas;

    } else {

      /*新增*/
      let retParamEv = new RetParamEv();
      retParamEv = await this.newAgenda(agdata);

      //提交服务器
      let agdPro: AgdPro = new AgdPro();
      //restFul保存事件日程
      this.setAgdPro(agdPro, agdata,retParamEv.rtevi);
      // 语音创建的时候，如果不同步，会导致服务器还没有保存完日程，保存联系人的请求就来了，导致查不到日程无法触发共享联系人动作
      // 必须增加await，否则，页面创建和语音创建方法必须分开
      let rst = await this.agdRest.save(agdPro);
      console.log(JSON.stringify(rst));

      //如果网络正常提交到服务器，则更新同步标志
      if (rst !=  anyenum.Err.netbroken){
        let sq =`update gtd_ev set wtt = ${moment().unix()} , tb = '${anyenum.SyncType.synch}'
        where rtevi = '${retParamEv.rtevi}' ;`;

        await  this.sqlExce.execSql(sq);
      }

      this.emitService.emitRef(agdata.sd);
      console.log(agdata);

      return retParamEv.outAgdatas;
    }
  }

  /**
   * 新增日程
   * @param {AgendaData} agdata
   * @returns {Promise<Array<AgendaData>>}
   */
  private async newAgenda(agdata: AgendaData):Promise<RetParamEv> {

    //设置页面参数初始化
    this.initAgdParam(agdata);
    console.log(JSON.stringify(agdata));

    //事件sqlparam 及提醒sqlparam
    let retParamEv = new RetParamEv();
    retParamEv = this.sqlparamAddEv2(agdata);
    console.log(JSON.stringify(retParamEv));


    //日程表sqlparam
    let caparam = new Array<any>();
    caparam = this.sqlparamAddCa(retParamEv.rtevi,agdata.sd,retParamEv.ed,agdata);
    console.log(JSON.stringify(caparam));

    //批量本地入库
    let sqlparam = new Array<any>();
    sqlparam = [...retParamEv.sqlparam, ...caparam];
    await this.sqlExce.batExecSqlByParam(sqlparam);

    return retParamEv;
  }

  /**
   * 更新日程
   * @param {AgendaData} agdata
   * @param {ModifyType} modiType
   * @returns {Promise<Array<AgendaData>>}
   */
  private async updateAgenda(agdata: AgendaData, modiType : anyenum.ModifyType):Promise<Array<AgendaData>> {


    let outAgds = new Array<AgendaData>();

    //批量本地更新
    let sqlparam = new Array<any>();

    /*如果只改当天，则
    1.修改当前数据内容 2.日程表新增一条对应数据 3重建相关提醒
    如果改变从当前所有，则
    1.改变原日程结束日 2.删除从当前所有事件及相关提醒 3.新建新事件日程*/
    if (modiType == anyenum.ModifyType.FromSel ){

      let sq : string ;
      //删除原事件中从当前开始所有日程

      //主evi设定
      let masterEvi : string;
      if (agdata.rtevi == ""){
        masterEvi = agdata.evi;
      }else {
        masterEvi = agdata.rtevi;
      }

      sq = `delete from gtd_ev where evd >= '${agdata.evd}' and (evi = '${masterEvi}' or rtevi =  '${masterEvi}') `;
      sqlparam.push(sq);

      //删除原事件中从当前日程开始所有提醒
      sq = `delete from gtd_wa where wai in (select evi from gtd_ev 
          where evd >= '${agdata.evd}' and (evi = '${masterEvi}' or rtevi =  '${masterEvi}') `;
      sqlparam.push(sq);

      //更新原事件日程结束日
      let caevi : string = masterEvi;

      let ca = new CaTbl();
      ca.evi = caevi;
      ca.ed = moment(agdata.evd).subtract(1,'d').format("YYYY/MM/dd");
      sqlparam.push(ca.upTParam());

      //新建新事件日程
      let newAgdata = {} as AgendaData;
      Object.assign(newAgdata ,agdata );

      let retParamEv = new RetParamEv();
      retParamEv = await this.newAgenda(newAgdata);

      sqlparam = [...sqlparam, ...retParamEv.sqlparam];
      outAgds = retParamEv.outAgdatas;

    }else if(modiType == anyenum.ModifyType.OnlySel) {

      //事件表更新

      let rtjon = new RtJson();
      rtjon.cycletype = anyenum.CycleType.close;
      rtjon.over.value = "";
      rtjon.over.type = anyenum.OverType.fornever;
      rtjon.cyclenum = 1;
      rtjon.openway = new Array<number>();
      agdata.rt = JSON.stringify(rtjon);
      agdata.rts = !agdata.rts ? "" : agdata.rts ;

      if (agdata.rfg == anyenum.RepeatFlag.Repeat){
        agdata.rfg = anyenum.RepeatFlag.RepeatToNon;
      }

      agdata.tx = JSON.stringify(agdata.txjson);

      let ev = new EvTbl();
      ev.evi = agdata.evi;
      ev.evn = agdata.evn;
      ev.evd = agdata.evd;
      ev.ji = agdata.ji;
      ev.bz = agdata.bz;
      ev.tx = agdata.tx;
      ev.txs = agdata.txs;
      ev.rt = agdata.rt;
      ev.rts = agdata.rts;
      ev.rfg = agdata.rfg;

      sqlparam.push(ev.upTParam());

      let outAgd  = {} as AgendaData;
      Object.assign(outAgd,ev);
      outAgds.push(agdata);

      // 删除相关提醒
      let wa = new WaTbl();
      wa.obi = agdata.evi;
      wa.obt = anyenum.ObjectType.Event;
      sqlparam.push(wa.dTParam());

      //提醒新建
      if (agdata.txjson.type != anyenum.TxType.close) {
        sqlparam.push(this.sqlparamAddTxWa(ev, agdata.st, agdata.al, agdata.txjson).rpTParam());
      }
      //日程表新建或更新
      let caparam = new Array<any>();
      caparam = this.sqlparamAddCa(agdata.evi ,agdata.evd,agdata.evd,agdata);
      console.log(JSON.stringify(caparam));

      sqlparam = [...sqlparam, ...caparam];

    }

    await this.sqlExce.batExecSqlByParam(sqlparam);

    return outAgds;
    /*
    await this.sqlExce.update(c);
    if(c.rt=="0" || (c.rt != "0" && c.sn != oldc.sn)){
      //restful用参数
      let agd = new AgdPro();
      this.setAdgPro(agd, c);
      await this.agdRest.save(agd);
    }
    this.emitService.emitRef(scd.sd);*/

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

    //agdata.tx = !agdata.tx ? JSON.stringify(txjson) : agdata.tx ;
    agdata.txjson = (agdata.txjson && agdata.txjson !=null) ? agdata.txjson : txjson;

    agdata.txs = !agdata.txs ? "" : agdata.txs ;

    let rtjon = new RtJson();
    rtjon.cycletype = anyenum.CycleType.close;
    rtjon.over.value = "";
    rtjon.over.type = anyenum.OverType.fornever;
    rtjon.cyclenum = 1;
    rtjon.openway = new Array<number>();
    //agdata.rt = !agdata.rt ? JSON.stringify(rtjon) : agdata.rt ;
    agdata.rtjson = (agdata.rtjson && agdata.rtjson !=null) ? agdata.rtjson : rtjon;

    agdata.rts = !agdata.rts ? "" : agdata.rts ;


    agdata.fj = !agdata.fj ? "" : agdata.fj ;
    agdata.pn = !agdata.pn ? 0 : agdata.pn ;
    agdata.md = !agdata.md ? anyenum.ModiPower.disable : agdata.md ;
    agdata.iv = !agdata.iv ? anyenum.InvitePowr.disable : agdata.iv ;
    agdata.sr = !agdata.sr ? "" : agdata.sr ;
    agdata.gs = !agdata.gs ? anyenum.GsType.self : agdata.gs ;
    agdata.tb = !agdata.tb ? anyenum.SyncType.unsynch : agdata.tb ;
    agdata.del = !agdata.del ? anyenum.DelType.undel : agdata.del ;
    agdata.rfg = !agdata.rfg ? anyenum.RepeatFlag.NonRepeat : agdata.rfg ;

    agdata.sd = agdata.sd || agdata.evd || moment().format("YYYY/MM/DD");
    agdata.ed = agdata.ed || agdata.sd;
    agdata.al = !agdata.al ? anyenum.IsWholeday.Whole :agdata.al;
    agdata.st = !agdata.st ? "00:00" : agdata.st;
    agdata.et = !agdata.et ? "23:59" : agdata.et;
    agdata.ct = !agdata.ct ? 0 :agdata.ct;
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

  private sqlparamAddEv2(agdata: AgendaData): RetParamEv {

    let ret = new RetParamEv();
    let outAgds = new Array<AgendaData>();

    let rtjson: RtJson = agdata.rtjson;
    agdata.rt = JSON.stringify(agdata.rtjson);

    if (rtjson.cycletype == anyenum.CycleType.close){

      agdata.rfg = anyenum.RepeatFlag.NonRepeat;
    }else{

      agdata.rfg = anyenum.RepeatFlag.Repeat;
    }

    let txjson : TxJson  = agdata.txjson;
    agdata.tx = JSON.stringify(agdata.txjson);

    // 开始日期
    let repeatStartDay: string = agdata.sd;
    // 重复类型（天/周/月/年）
    let repeatType: moment.unitOfTime.DurationConstructor = "days";
    // 重复周期（n天/n周/n月/n年重复一次）
    let repeatStep: number = rtjson.cyclenum || 1;
    // 开启方式（天（无）,周多选（一、二、三、四、五、六、日[0 - 6]）,月多选（1、2、...、31[0 - 30]）,年（无））
    let options: Array<number> = new Array<number>();
    // 结束条件（n次后结束、到某天结束、永远不结束（天（设置1年）、周（设置2年）、月（设置3年）、年（设置20年）））
    let repeatTimes: number;
    // 结束日期（指定结束日期时使用指定结束日期，否则使用计算出来的结束日期）
    let repeatEndDay: string = "";

    // 根据结束类型设置重复次数/结束日期
    switch(rtjson.over.type) {
      case anyenum.OverType.times :
        this.assertEmpty(rtjson.over.value);    // 结束条件不能为空
        this.assertNumber(rtjson.over.value);   // 结束条件不能为数字字符串以外的值
        repeatTimes = (Number(rtjson.over.value) > 0)? Number(rtjson.over.value) : 1;
        break;
      case anyenum.OverType.limitdate :
        this.assertEmpty(rtjson.over.value);    // 结束条件不能为空
        repeatEndDay = rtjson.over.value;
        break;
      case anyenum.OverType.fornever :
        break;
      default:
        this.assertFail();    // 预期外值, 程序异常
    }

    // 根据重复类型设置 重复类型/开启方式/重复次数/结束日期
    switch(rtjson.cycletype) {
      case anyenum.CycleType.day :
        repeatType = "days";
        repeatTimes = repeatTimes || moment(repeatStartDay).add(1, "years").diff(repeatStartDay, "days");
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes, "days").add(1, "days").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.week :
        repeatType = "weeks";
        options = rtjson.openway || options;
        repeatTimes = repeatTimes || moment(repeatStartDay).add(2, "years").diff(repeatStartDay, "weeks");
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes, "weeks").add(1, "days").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.month :
        repeatType = "months";
        options = rtjson.openway || options;
        repeatTimes = repeatTimes || moment(repeatStartDay).add(3, "years").diff(repeatStartDay, "months");
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes, "months").add(1, "days").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.year :
        repeatType = "years";
        repeatTimes = 20;
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(20, "years").add(1, "days").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.close :    // 不重复日程
        repeatType = "days";
        repeatTimes = 1;
        repeatEndDay = moment(repeatStartDay).add(1, "days").format("YYYY/MM/DD");
        break;
      default:
        this.assertFail();    // 预期外值, 程序异常
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
          let dayOfMonth: number = Number(moment(stepDay).format("D"));
          let maxDayOfMonth: number = moment().month(moment(stepDay).month()).endOf('month').days();

          for (let option of options) {

            // 当月没有这一天
            if (option > maxDayOfMonth) {
              break;
            }

            let duration: number = option - dayOfMonth;

            if (duration == 0) {
              days.push(stepDay);     // 当前日期为重复日期
            } else if (duration > 0) {
              //当月日期
              days.push(moment(stepDay).add(duration, "days").format("YYYY/MM/DD"));
            } else {
              //下月日程（跨月）
              days.push(moment().month(moment(stepDay).month()).add(1, "months").days(option).format("YYYY/MM/DD"));
            }
          }

        } else {
          this.assertFail();    // 预期外值, 程序异常
        }
      } else {
        // 普通重复
        days.push(stepDay);
      }

      for (let day of days) {

        // 判断是否超过结束日期
        if (!moment(day).isBefore(repeatEndDay)) {
          continue;
        }

        let ev = new EvTbl();

        Object.assign(ev, agdata);

        ev.evi = this.util.getUuid();

        // 非重复日程及重复日程的第一条的rtevi（父日程evi）字段设为空。遵循父子关系，
        // 父记录的父节点字段rtevi设为空，子记录的父节点字段rtevi设为父记录的evi
        if (ret.sqlparam.length < 1) {
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
        ret.ed = ev.evd;
        ret.sqlparam.push(ev.rpTParam());
        if (txjson.type != anyenum.TxType.close) {
          ret.sqlparam.push(this.sqlparamAddTxWa(ev,agdata.st,agdata.al,txjson).rpTParam());
        }

        //新增数据需要返回出去
        let outAgd = {} as AgendaData;
        Object.assign(outAgd,ev);
        outAgds.push(outAgd);
      }

      stepDay = moment(stepDay).add(repeatStep, repeatType).format("YYYY/MM/DD");
    }

    ret.outAgdatas = outAgds;
    return ret;
  }

  /**
   *获取提醒表sql
   * @param {EvTbl}
   * @param {ev: EvTbl,st:string ,sd:string,txjson :TxJson }
   * @returns {ETbl}
   */
  private sqlparamAddTxWa(ev: EvTbl,st:string,al: string, txjson :TxJson ): WaTbl {
    let wa = new WaTbl();//提醒表
    wa.wai = this.util.getUuid();
    wa.obt = anyenum.ObjectType.Event;
    wa.obi = ev.evi;
    //todo tx需要解析
    //let tx  = ;
    if (txjson.type != anyenum.TxType.close) {
      wa.st = ev.evn;
      let time = parseInt(txjson.type);
      let date;
      if (al == anyenum.IsWholeday.NonWhole) {
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
   * @param {string} rtevi
   * @param {string} sd
   * @param {string} ed
   * @param {AgendaData} agdata
   * @returns {Array<any>}
   */
  private sqlparamAddCa(rtevi : string,sd : string ,ed :string, agdata : AgendaData): Array<any> {

    agdata.sd = sd;
    agdata.ed = ed;
    if (agdata.al == anyenum.IsWholeday.Whole){
      agdata.st = "00:00";
      agdata.et = "23:59";
    }else{
      //不是全天，结束时间通过时长计算
      if (agdata.ct == 0 ){
        agdata.et = agdata.st;
      }else{
        let tmpdatetime1 = moment(agdata.ed + " " + agdata.st).add(agdata.ct, 'm');
        //时长相加后，如果超出一天，则使用当天的23:59
        if (moment(tmpdatetime1).isBefore(moment(agdata.ed + " " + "00:00").add(1,'d'))){
          agdata.et = moment(tmpdatetime1).format("HH:mm");
        }else{
          agdata.et = "23:59";
        }
      }
    }

    if(agdata.ed==''){
      agdata.ed = agdata.sd;
    }
    if(agdata.et==''){
      agdata.et = agdata.st;
    }

    let ca = new CaTbl();
    ca.evi = rtevi;
    ca.sd = agdata.sd;
    ca.ed = agdata.ed;
    ca.ct = agdata.ct;
    ca.al = agdata.al;
    ca.st = agdata.st;
    ca.ed = agdata.ed;
    ca.et = agdata.et;

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
		let evi: string ="";
		if(tx.evi) {
			evi = tx.evi;
			//更新任务事件
			let evdb: EvTbl = new EvTbl();
			tx.mi = UserConfig.account.id; //更新者
			Object.assign(evdb, tx);
		  await this.sqlExce.updateByParam(evdb);
		  let ttdb: TTbl = new TTbl();
			//根据主键ID获取任务详情
			ttdb.evi = tx.evi;
			let ttdbNew = await this.sqlExce.getOneByParam<TTbl>(ttdb);
			if (ttdbNew && ttdbNew.evi) {
				Object.assign(ttdbNew, tx);
				await this.sqlExce.updateByParam(ttdb);
			}
		} else {
			//创建事件
			tx.evi = this.util.getUuid();
			evi = tx.evi;
			tx.ui = UserConfig.account.id;
			tx.type = anyenum.EventType.Task;
			tx.evd = tx.evd || moment().format('YYYY/MM/DD');
			tx.gs = anyenum.GsType.self;
			tx.tb = anyenum.SyncType.unsynch;
			tx.del = anyenum.DelType.undel;
			let evdb: EvTbl = new EvTbl();
			Object.assign(evdb, tx);
			await this.sqlExce.saveByParam(evdb);
			//创建任务
			let ttdb: TTbl = new TTbl();
			tx.cs = anyenum.IsSuccess.wait;
			if(tx.isrt==''||tx.isrt == null || tx.isrt == "undefined")
			{
				tx.isrt = anyenum.IsCreate.isNo;
			}
			Object.assign(ttdb, tx);
			await this.sqlExce.saveByParam(ttdb);
		}
		let txx: TaskData = {} as TaskData;
		if(evi !="")
		{
			console.info("获取evi--"+evi);
			let params= Array<any>();
			let sqlparam: string =`select ev.*,td.cs,td.isrt,td.cd,td.fd from gtd_ev  ev left join gtd_t  td on ev.evi = td.evi where ev.evi ='${evi}'`;
			console.info("执行的SQL"+sqlparam);
			txx = await this.sqlExce.getExtOneByParam<TaskData>(sqlparam,params);
			console.info("执行的结果"+txx.evi);
		}
		return txx;
  }

	/**
	 * 根据事件ID获取任务
	 */
	async getTask(evi: string): Promise<TaskData> {
			this.assertEmpty(evi); // id不能为空
//			let sqlparam: string =`select ev.*,td.cs,td.isrt,td.cd,td.fd from gtd_ev  ev left join gtd_t  td on ev.evi = td.evi where ev.evi =${evi} `;
  		let evdb: EvTbl = new EvTbl();
  		evdb.evi = evi;
  		let evdbNew =  await this.sqlExce.getOneByParam<EvTbl>(evdb);
  		let data: TaskData  = {} as TaskData;
//		data = await this.sqlExce.getExtOneByParam<TaskData>(sqlparam,null);
			Object.assign(data, evdbNew);
  		return data;
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
			minitask.evd = moment().format('YYYY/MM/DD');
			minitask.gs = anyenum.GsType.self;
			minitask.tb = anyenum.SyncType.unsynch;
			minitask.del = anyenum.DelType.undel;
			let evdb: EvTbl = new EvTbl();
			Object.assign(evdb, minitask);
			await this.sqlExce.saveByParam(evdb);
		}
		return minitask;
  }

	async getMiniTask(evi: string): Promise<MiniTaskData> {
			this.assertEmpty(evi); // id不能为空
			let evdb: EvTbl = new EvTbl();
			evdb.evi = evi;
			let evdbnew = await this.sqlExce.getOneByParam<EvTbl>(evdb);
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
  async finishTask(evi: string):  Promise <string> {
  	this.assertEmpty(evi); // 事件ID不能为空
  	let tdb: TTbl = new TTbl();
		tdb.evi = evi;
		tdb.cs = anyenum.IsSuccess.success;
		tdb.fd = moment().format('YYYY/MM/DD');
		await this.sqlExce.updateByParam(tdb);
		//TODO 是否推送事件完成消息
		//this.emitService.emit(`mwxing.event.task.finish`);
		return tdb.isrt;
  }

  /**
   * 当是自动创建的任务的情况下,进行下一步操作
   * @author ying<343253410@qq.com>
   */
  async finishTaskNext(evi: string) {
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
			await this.saveTask(tx);
		}
		return ;
  }
	 /**
   * 根据evi获取复制的任务
   */
  async getTaskNext(evi: string): Promise <TaskData> {
  	this.assertEmpty(evi);
  	let evdb: EvTbl = new EvTbl();
		evdb.rtevi = evi;
		let evdbNew = await this.sqlExce.getOneByParam<EvTbl>(evdb);
		let tx: TaskData = {} as TaskData;
		Object.assign(tx, evdbNew);
		return tx;
  }

  sendEvent() {}
  receivedEvent() {}
  acceptReceivedEvent() {}
  rejectReceivedEvent() {}
  syncEvent() {}
  syncEvents() {}

  /**
	 * 根据年月日检索任务  只检索任务,不检索小任务
	 * @author ying<343253410@qq.com>
	 */
  async fetchPagedTasks(day: string = moment().format('YYYY/MM/DD'),evi: string): Promise<Array<TaskData>>{
  	this.assertEmpty(day); //验证日期是否为空
  	let sqlparam: string =`select ev.*,td.cs,td.isrt,td.cd,td.fd from gtd_ev  ev left join gtd_t  td on ev.evi = td.evi where 1=1 and ev.type='${anyenum.EventType.Task}' and  ev.evd = '${day}'  ${(evi)? ('and ev.evi>'+evi):''} limit 10`;
  	let data: Array<TaskData> = new Array<TaskData>();
  	data = await this.sqlExce.getExtList<TaskData>(sqlparam);
  	return data;
  }

  /**
	 * 检索完成任务
	 * @author ying<343253410@qq.com>
	 */
  async fetchPagedCompletedTasks(day: string = moment().format('YYYY/MM/DD'),evi: string): Promise<Array<TaskData>> {
  	this.assertEmpty(day); //验证日期是否为空
  	let sqlparam: string =`select ev.*,td.cs,td.isrt,td.cd,td.fd from gtd_ev ev left join gtd_t  td on ev.evi = td.evi and td.cs='${anyenum.IsSuccess.success}' where 1=1 and ev.type='${anyenum.EventType.Task}' and  ev.evd = '${day}'  ${(evi)? ('and ev.evi>'+evi):''} limit 10`;
  	let data: Array<TaskData> = new Array<TaskData>();
  	data = await this.sqlExce.getExtList<TaskData>(sqlparam);
  	return data;
  }

  /**
	 * 检索未完成的任务
	 * @author ying<343253410@qq.com>
	 */
  async fetchPagedUncompletedTasks(day: string = moment().format('YYYY/MM/DD'),evi: string): Promise<Array<TaskData>> {
  	this.assertEmpty(day); //验证日期是否为空
  	let sqlparam: string =`select ev.*,td.cs,td.isrt,td.cd,td.fd from gtd_ev  ev left join gtd_t  td on ev.evi = td.evi and td.cs='${anyenum.IsSuccess.wait}' where 1=1 and ev.type='${anyenum.EventType.Task}' and  ev.evd = '${day}'  ${(evi)? ('and ev.evi>'+evi):''} limit 10`;
  	let data: Array<TaskData> = new Array<TaskData>();
  	data = await this.sqlExce.getExtList<TaskData>(sqlparam);
  	return data;

  }

  /**
   * 备份,三张表备份
	 * @author ying<343253410@qq.com>
   */
  async backup(bts: Number) {
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
   * 恢复
	 * @author ying<343253410@qq.com>
   */
  async recovery(outRecoverPro: OutRecoverPro, bts: Number = 0) {
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
			await this.sqlExce.dropByParam(ev);
			//恢复数据
			for(let j = 0, len = outRecoverProNew.ev.length; j < len; j++) {
				let ev = new EvTbl();
				Object.assign(ev, outRecoverProNew.ev[j]);
				sqls.push(ev.inTParam());
			}
			await this.sqlExce.batExecSql(sqls);
		}
		//恢复日程表
		if (outRecoverProNew.ca.length > 0) {
			let ca = new CaTbl();
			let sqls = new Array <string> ();
			//先删除
			await this.sqlExce.dropByParam(ca);
			//恢复数据
			for(let j = 0, len = outRecoverProNew.ca.length; j < len; j++) {
				let ca = new CaTbl();
				Object.assign(ca, outRecoverProNew.ca[j]);
				sqls.push(ca.inTParam());
			}
			await this.sqlExce.batExecSql(sqls);
		}
		//恢复任务表
		if (outRecoverProNew.tt.length > 0) {
			let tt = new TTbl();
			let sqls = new Array <string> ();
			//先删除
			await this.sqlExce.dropByParam(tt);
			//恢复数据
			for(let j = 0, len = outRecoverProNew.tt.length; j < len; j++) {
				let tt = new TTbl();
				Object.assign(tt, outRecoverProNew.tt[j]);
				sqls.push(tt.inTParam());
			}
			await this.sqlExce.batExecSql(sqls);
		}
		return ;
  }
}

export interface EventData extends EvTbl {

}

//画面传入事件service参数体
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
  outAgdatas = new Array<AgendaData>();
}

export class RtOver {
  type: anyenum.OverType = anyenum.OverType.fornever;
  value:string;
}

export class RtJson {
  //重复类型
  cycletype: anyenum.CycleType = anyenum.CycleType.close;
  //重复次数（n天、n周、n月、n年）
  cyclenum: number = 1;//重复周期默认1, 不得小于1
  //开启方式：周一，周二....
  openway: Array<number> = new Array<number>();

  //重复结束设定
  over: RtOver = new RtOver();
}

export class TxJson {
  type: anyenum.TxType;
}
