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
import {DataRestful, PullInData, PushInData, SyncData} from "../restful/datasev";
import {SyncType, DelType, IsSuccess, SyncDataStatus, PageDirection, SyncDataSecurity} from "../../data.enum";

@Injectable()
export class EventService extends BaseService {
  constructor(private sqlExce: SqliteExec, private util: UtilService,
              private agdRest: AgdRestful,private emitService:EmitService,
              private bacRestful: BacRestful,private userConfig: UserConfig,
              private dataRestful: DataRestful) {
    super();
  }

  /**
   * 接收事件日程保存到本地
   * @param {Array<AgendaData>} pullAgdatas
   * @param {SyncDataStatus} status
   * @returns {Promise<Array<AgendaData>>}
   */
  async receivedAgendaData(pullAgdatas: Array<AgendaData>, status: SyncDataStatus): Promise<Array<AgendaData>> {

    this.assertEmpty(pullAgdatas);     // 入参不能为空
    this.assertEmpty(status);   // 入参不能为空

    let sqlparam = new Array<any>();

    if (pullAgdatas && pullAgdatas !=null ){
      for (let j = 0 , len = pullAgdatas.length; j < len ; j++){
        let agd = {} as AgendaData;
        agd = pullAgdatas[j];
        agd.del = status;
        agd.tb = SyncType.synch;

        let ev = new EvTbl();
        Object.assign(ev,agd);
        sqlparam.push(ev.rpTParam());

        //相关日程更新
        if (agd.sd && agd.sd != ''){
          let ca = new CaTbl();
          Object.assign(ca,agd);
          sqlparam.push(ca.rpTParam());
        }

        //相关附件更新
        if (agd.fjs && agd.fjs !=null && agd.fjs.length > 0){
          for ( let k = 0, len = agd.fjs.length; k < len ; k++ ){
            let fj = new FjTbl();
            Object.assign(fj,agd.fjs[k]);
            sqlparam.push(fj.rpTParam());
          }
        }

        //相关参与人更新
        if (agd.parters && agd.parters !=null && agd.parters.length > 0){
          for ( let k = 0, len = agd.parters.length; k < len ; k++ ){
            let par = new ParTbl();
            Object.assign(par,agd.parters[k]);
            sqlparam.push(par.rpTParam());
          }
        }
      }
    }

    return pullAgdatas;
  }

  /**
   * 接收日程数据同步
   *
   * @author leon_xi@163.com
   **/
  async receivedAgenda(evi: string) {

    this.assertEmpty(evi);   // 入参不能为空

    let pull: PullInData = new PullInData();

    pull.d.push(evi);

    // 发送下载日程请求
    await this.dataRestful.pull(pull);

    return;
  }

  /**
   * 同步指定日程
   *
   * @author leon_xi@163.com
   **/
  async syncAgenda(uploadAgdDatas: Array<AgendaData>) {

    this.assertEmpty(uploadAgdDatas);       // 入参不能为空

    // 构造Push数据结构
    let push: PushInData = new PushInData();

    for (let j = 0 ,len = uploadAgdDatas.length ; j< len ; j++){
      let agd = {} as AgendaData;
      agd = uploadAgdDatas[j];
      let sync: SyncData = new SyncData();
      sync.id = agd.evi;
      sync.type = "Agenda";

      //修改权限设定
      if (agd.md == anyenum.ModiPower.disable){
        sync.security = SyncDataSecurity.SelfModify;
      }
      if (agd.md == anyenum.ModiPower.enable){
        sync.security = SyncDataSecurity.ShareModify;
      }

      //删除设定
      if (agd.del == anyenum.DelType.del){
        sync.status = SyncDataStatus.Deleted;
      }
      sync.to = (!agd.tos || agd.tos == "" || agd.tos == null) ? [] : agd.tos.split(",") ;
      sync.payload = agd;
      push.d.push(sync);
    }



    await this.dataRestful.push(push);

    return;
  }

  /**
   * 页面判断重复设置是否改变
   * @param {AgendaData} newAgd
   * @param {AgendaData} oldAgd
   * @returns {boolean}
   */
  isAgendaChanged(newAgd : AgendaData ,oldAgd : AgendaData): boolean{
    //重复选项发生变化
    if (newAgd.rtjson.cycletype != oldAgd.rtjson.cycletype){
      return true;
    }
    if (newAgd.rtjson.cyclenum != oldAgd.rtjson.cyclenum){
      return true;
    }
    if (!newAgd.rtjson.openway != !oldAgd.rtjson.openway){
      return true;
    }
    if (newAgd.rtjson.openway.length != oldAgd.rtjson.openway.length){
      return true;
    }
    //判断newAgd.rtjson.openway每个值是否相同
    if (newAgd.rtjson.openway && oldAgd.rtjson.openway){
      let opstr : string = newAgd.rtjson.openway.join(',');
      let oldopstr : string = oldAgd.rtjson.openway.join(',');
      if (opstr != oldopstr){
        return true;
      }
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
   * 取得日程相关所有信息
  * @param {string} evi
   * @returns {Promise<Array<AgendaData>>}
   */
  async getAgenda(evi : string):Promise<AgendaData>{

    this.assertEmpty(evi);    // 入参不能为空

    let agdata = {} as AgendaData;
    //获取事件详情
    let sql: string = `select * from gtd_ev where evi = ? and del = ?`;
    let ev: EvTbl = await this.sqlExce.getExtOneByParam<EvTbl>(sql, [evi, DelType.undel]);

    // 如果事件不存在
    if (!ev) {
      return null;
    }

    Object.assign(agdata , ev);
    agdata.rtjson = JSON.parse(agdata.rt);
    agdata.txjson = JSON.parse(agdata.tx);

    //主evi设定
    let masterEvi : string;
    if (agdata.rtevi == ""){
      //非重复数据或重复数据的父记录
      masterEvi = agdata.evi;
    }else if (agdata.rfg == anyenum.RepeatFlag.RepeatToNon){
      //重复中独立数据
      masterEvi = agdata.evi;
    }else{
      //重复数据
      masterEvi = agdata.rtevi;
    }

    //取得日程表详情
    let ca = new CaTbl();
    ca.evi = masterEvi;
    ca = await  this.sqlExce.getOneByParam<CaTbl>(ca);
    agdata.sd = ca.sd ;
    agdata.st = ca.st ;
    agdata.ed = ca.ed ;
    agdata.et = ca.et ;
    agdata.al = ca.al ;
    agdata.ct = ca.ct ;

    //取得计划详情
    let jha = new JhaTbl();
    jha.ji = agdata.ji;
    jha = await this.sqlExce.getOneByParam<JhaTbl>(jha);
    agdata.jha = jha;

    //附件数据
    let fj = new FjTbl();
    fj.obi = agdata.evi;
    fj.obt = anyenum.ObjectType.Event;
    let fjs = new Array<FjTbl>();
    fjs = await this.sqlExce.getLstByParam<FjTbl>(fj);
    agdata.fjs = fjs;
    //附件数量
    if (fjs != null){
      agdata.fj = fjs.length +"";
    }else{
      agdata.fj = 0 + "";
    }


    if(agdata.gs == '0'){
      //共享人信息
      agdata.parters = await this.getParterByEvi(masterEvi);
      //参与人数量
      if (agdata.parters !=null){
        agdata.pn = agdata.parters.length ;
      }else{
        agdata.pn = 0 ;
      }
    }

    if(agdata.gs == '1'){
      //发起人信息
      agdata.originator = await this.getParterByUi(agdata.ui);
    }
    return agdata;

  }

  /**
   * 根据事件Id获取联系人信息
   * @returns {Promise<Array<Parter>>}
   */
  private async getParterByEvi(evi:string):Promise<Array<Parter>>{
    let parters: Array<Parter> =new Array<Parter>();
    //共享人信息
    let pars: Array<ParTbl> = new Array<ParTbl>();
    let par = new ParTbl();
    par.obi = evi;
    par.obt = anyenum.ObjectType.Event;
    pars = await this.sqlExce.getLstByParam<ParTbl>(par);
    for (let j = 0, len = pars.length; j < len; j++) {
      let parter = {} as Parter;

      parter = this.userConfig.GetOneBTbl2(pars[j].pwi);
      if(parter && parter != null){
        parters.push(parter);
      }
    }
    return parters;
  }

  /**
   * 根据用户Id获取联系人信息
   * @returns {Promise<Parter>}
   */
  private async getParterByUi(ui:string):Promise<Parter>{
    let parter = {} as Parter;
    //发起人信息
    let tmp = this.userConfig.GetOneBTbl2(ui);
    if (tmp) {
      parter = tmp;
    }else{
      //不存在查询数据库
      let b = new BTbl();
      b.ui = ui;
      b = await this.sqlExce.getExtOne<BTbl>(b.slT());
      if(b != null){
        Object.assign(parter, b);
        parter.bhiu = DataConfig.HUIBASE64;
      }else{
        console.error("=======PgbusiService 获取发起人失败 =======")
      }
    }
    return parter;
  }

  /**
   * 删除事件
   * @param {AgendaData} oriAgdata
   * @param {OperateType} delType
   * 删除非重复事件、重复事件中的独立日使用OperateType.OnlySel
   * 删除重复事件使用OperateType.FromSel
   * @returns {Promise<Array<AgendaData>>}
   */
  async removeAgenda(oriAgdata : AgendaData, delType : anyenum.OperateType):Promise<Array<AgendaData>>{

    let outAgds = new Array<AgendaData>();

    //批量本地更新
    let sqlparam = new Array<any>();

    if (delType == anyenum.OperateType.FromSel){
      let sq : string ;
      //删除事件中从当前开始所有事件
      //主evi设定
      let masterEvi : string;
      if (oriAgdata.rtevi == ""){
        masterEvi = oriAgdata.evi;
      }else {
        masterEvi = oriAgdata.rtevi;
      }

      //删除原事件中从当前开始所有事件
      await this.delFromsel(masterEvi ,oriAgdata ,oriAgdata.parters,sqlparam,outAgds);

    }else{

      let sq : string;
      let outAgd = {} as AgendaData;

      //删除事件表数据
      let ev = new EvTbl();
      ev.evi = oriAgdata.evi;
      ev.del = anyenum.DelType.del;
      ev.tb = anyenum.SyncType.unsynch;
      ev.mi = UserConfig.account.id;
      await this.sqlExce.updateByParam(ev);

      //事件对象放入返回事件
      Object.assign(outAgd,ev);
      outAgds.push(outAgd);

      //主evi设定
      let masterEvi : string;
      if (oriAgdata.rtevi == ""){
        //非重复数据或重复数据的父记录
        masterEvi = oriAgdata.evi;
      }else if (oriAgdata.rfg == anyenum.RepeatFlag.RepeatToNon){
        //重复中独立日
        masterEvi = oriAgdata.evi;
      }else{
        //重复数据
        masterEvi = oriAgdata.rtevi;
      }

      //更新原事件日程结束日或事件表无记录了则删除
      sq = `select * from gtd_ev where (evi = '${masterEvi}' or rtevi =  '${masterEvi}') and del <>'${anyenum.DelType.del}' ;`;
      let evtbls = new Array<EvTbl>();
      evtbls = await this.sqlExce.getExtList<EvTbl>(sq);

      let caevi : string = masterEvi;
      let ca = new CaTbl();
      ca.evi = caevi;
      ca = await this.sqlExce.getOneByParam<CaTbl>(ca);

      if (evtbls.length == 0){
        sqlparam.push(ca.dTParam());

        //本地删除事件参与人
        let par: ParTbl = new ParTbl();
        par.obt = anyenum.ObjectType.Event;
        par.obi = masterEvi;
        par.del = anyenum.DelType.del;
        par.tb = anyenum.SyncType.unsynch;
        sqlparam.push(par.upTParam());

        //本地删除附件
        let fj: FjTbl = new FjTbl();
        fj.obt = anyenum.ObjectType.Event;
        fj.obi = masterEvi;
        fj.del = anyenum.DelType.del;
        fj.tb = anyenum.SyncType.unsynch;
        sqlparam.push(fj.upTParam());

        //取得所有删除的参与人
        let delpars = new Array<Parter>();
        let delpar = new  ParTbl();
        delpar.obt = anyenum.ObjectType.Event;
        delpar.obi = masterEvi;
        delpars = await this.sqlExce.getLstByParam<Parter>(delpar);

        //取得所有删除的附件
        let delfjs = new Array<FjTbl>();
        let delfj = new  FjTbl();
        delfj.obt = anyenum.ObjectType.Event;
        delfj.obi = masterEvi;
        delfjs = await this.sqlExce.getLstByParam<FjTbl>(delfj);

        //删除的日程放入返回事件的事件对象
        Object.assign(outAgd,ca);
        //把删除参与人放入事件信息
        outAgd.parters = delpars;
        //把删除的附件复制放入事件信息
        outAgd.fjs = delfjs;

      }else{
        if (!oriAgdata.rtevi && oriAgdata.rtevi =="" && oriAgdata.rfg == anyenum.RepeatFlag.Repeat){

          //是父对象删除则原对应日程删除
          sqlparam.push(ca.dTParam());

          //本地删除事件参与人
          let par: ParTbl = new ParTbl();
          par.obt = anyenum.ObjectType.Event;
          par.obi = masterEvi;
          par.del = anyenum.DelType.del;
          par.tb = anyenum.SyncType.unsynch;
          sqlparam.push(par.upTParam());

          //本地删除附件
          let fj: FjTbl = new FjTbl();
          fj.obt = anyenum.ObjectType.Event;
          fj.obi = masterEvi;
          fj.del = anyenum.DelType.del;
          fj.tb = anyenum.SyncType.unsynch;
          sqlparam.push(fj.upTParam());

          //取得所有删除的参与人
          let delpars = new Array<Parter>();
          let delpar = new  ParTbl();
          delpar.obt = anyenum.ObjectType.Event;
          delpar.obi = masterEvi;
          delpars = await this.sqlExce.getLstByParam<Parter>(delpar);

          //取得所有删除的附件
          let delfjs = new Array<FjTbl>();
          let delfj = new  FjTbl();
          delfj.obt = anyenum.ObjectType.Event;
          delfj.obi = masterEvi;
          delfjs = await this.sqlExce.getLstByParam<FjTbl>(delfj);

          //删除的日程放入返回事件的事件对象
          Object.assign(outAgd,ca);
          //把删除参与人放入事件信息
          outAgd.parters = delpars;
          //把删除的附件复制放入事件信息
          outAgd.fjs = delfjs;

        }

        //如果当前删除对象是父事件，则为当前重复事件重建新的父事件，值为ev表重复记录里的第一条做为父事件
        await this.operateForParentAgd(oriAgdata,oriAgdata.parters,oriAgdata.fjs,sqlparam,outAgds);

      }

      // 删除相关提醒
      let wa = new WaTbl();
      wa.obi = oriAgdata.evi;
      wa.obt = anyenum.ObjectType.Event;
      sqlparam.push(wa.dTParam());

    }

    await this.sqlExce.batExecSqlByParam(sqlparam);
    return outAgds;
  }

  /**
   * 保存或修改事件
   * @param {AgendaData} newAgdata 新事件详情
   * @param {AgendaData} oriAgdata 原事件详情 修改场合必须传入
   * @param {OperateType} modiType
   * 修改非重复事件to非重复日程、重复事件中的某一日程to独立日程使用OperateType.OnlySel，
   * 修改重复事件to重复事件、非重复事件to重复事件使用OperateType.FromSel，
   * 新建事件使用 OperateType.Non
   * @returns {Promise<Array<AgendaData>>}
   */
  async saveAgenda(newAgdata : AgendaData, oriAgdata:AgendaData = null, modiType : anyenum.OperateType = anyenum.OperateType.Non): Promise<Array<AgendaData>> {
    // 入参不能为空
    this.assertEmpty(newAgdata);
    this.assertEmpty(newAgdata.sd);    // 事件开始日期不能为空
    this.assertEmpty(newAgdata.evn);   // 事件标题不能为空

    // 新建事件
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

      this.assertNotEqual(oriAgdata.sd, newAgdata.sd);//原事件的开始日期与新事件的开始事件没有一致

      let outAgdatas = await this.updateAgenda(newAgdata,oriAgdata,modiType);

      this.emitService.emit("mwxing.calendar.activities.changed", outAgdatas);

      return outAgdatas;

    } else {

      /*新增*/
      let retParamEv = new RetParamEv();
      retParamEv = await this.newAgenda(newAgdata);

      //提交服务器


      //如果网络正常提交到服务器，则更新同步标志同步通过websocket来通知

      this.emitService.emitRef(newAgdata.sd);

      this.emitService.emit("mwxing.calendar.activities.changed", retParamEv.outAgdatas);

      return retParamEv.outAgdatas;
    }
  }

  /**
   * 新增事件
   * @param {AgendaData} agdata
   * @returns {Promise<Array<AgendaData>>}
   */
  private async newAgenda(agdata: AgendaData):Promise<RetParamEv> {

    //设置页面参数初始化
    this.initAgdParam(agdata);
    //console.log(JSON.stringify(agdata));

    let sqlparam = new Array<any>();

    //事件sqlparam 及提醒sqlparam
    let retParamEv = new RetParamEv();
    retParamEv = this.sqlparamAddEv2(agdata);
    //console.log(JSON.stringify(retParamEv));


    //日程表sqlparam
    let caparam = new CaTbl();
    caparam = this.sqlparamAddCa(retParamEv.rtevi,agdata.sd,retParamEv.ed,agdata);
    sqlparam.push(caparam.rpTParam());

    let tos : string;//需要发送的参与人手机号
    tos = this.getParterPhone(agdata.parters);

    //日程表信息，附件信息，参与人信息放入返回事件的父记录信息中
    for (let j = 0, len = retParamEv.outAgdatas.length; j < len ; j++){
      let outAgd = {} as AgendaData;
      outAgd = retParamEv.outAgdatas[j];
      if (outAgd.rtevi == "" && outAgd.evi == caparam.evi){
        Object.assign(outAgd,caparam);

        outAgd.parters = agdata.parters;
        outAgd.fjs = agdata.fjs;
        //break;
      }
      outAgd.tos = tos;

    }

    //批量本地入库
    sqlparam = [...sqlparam, ...retParamEv.sqlparam];
    await this.sqlExce.batExecSqlByParam(sqlparam);

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


    let outAgds = new Array<AgendaData>();//返回事件


    //批量本地更新
    let sqlparam = new Array<any>();

    newAgdata.mi = UserConfig.account.id;

    let tos : string;//需要发送的参与人手机号
    tos = this.getParterPhone(newAgdata.parters);

    /*如果只改当天，则
    1.修改当前数据内容 2.日程表新增一条对应数据 3重建相关提醒
    如果改变从当前所有，则
    1.改变原日程结束日 2.删除从当前所有事件及相关提醒 3.新建新事件日程*/
    if (modiType == anyenum.OperateType.FromSel ){

      let sq : string ;

      let masterEvi : string;//主evi设定
      if (oriAgdata.rtevi == ""){
        masterEvi = oriAgdata.evi;
      }else {
        masterEvi = oriAgdata.rtevi;
      }

      //删除原事件中从当前开始所有事件
      await this.delFromsel(masterEvi ,oriAgdata ,newAgdata.parters,sqlparam,outAgds);

      //新建新事件日程
      let nwAgdata = {} as AgendaData;
      Object.assign(nwAgdata ,newAgdata );
      nwAgdata.sd = nwAgdata.evd;

      let retParamEv = new RetParamEv();
      retParamEv = await this.newAgenda(nwAgdata);

      //复制原参与人到新事件
      let nwpar = new Array<any>();
      nwpar = this.sqlparamAddPar(retParamEv.rtevi , newAgdata.parters);

      //复制原附件到新事件
      let nwfj = new Array<any>();
      nwfj = this.sqlparamAddFj(retParamEv.rtevi, newAgdata.fjs);

      sqlparam = [...sqlparam, ...retParamEv.sqlparam, ...nwpar, ...nwfj];

      //修改与新增记录合并成返回事件
      outAgds = [...outAgds, ...retParamEv.outAgdatas];

    }else if(modiType == anyenum.OperateType.OnlySel) {

      //事件表更新
      let outAgd  = {} as AgendaData;

      let rtjon = new RtJson();
      rtjon.cycletype = anyenum.CycleType.close;
      rtjon.over.value = "";
      rtjon.over.type = anyenum.OverType.fornever;
      rtjon.cyclenum = 1;
      rtjon.openway = new Array<number>();
      newAgdata.rt = JSON.stringify(rtjon);
      newAgdata.rts = !newAgdata.rts ? "" : newAgdata.rts ;

      if (oriAgdata.rfg == anyenum.RepeatFlag.Repeat){
        newAgdata.rfg = anyenum.RepeatFlag.RepeatToNon;
      }

      newAgdata.tx = JSON.stringify(newAgdata.txjson);
      newAgdata.tb = anyenum.SyncType.unsynch;
      let ev = new EvTbl();
      ev.evi = oriAgdata.evi;//evi使用原evi
      ev.evn = newAgdata.evn;
      ev.evd = newAgdata.evd;
      ev.ji = newAgdata.ji;
      ev.bz = newAgdata.bz;
      ev.tx = newAgdata.tx;
      ev.txs = newAgdata.txs;
      ev.rt = newAgdata.rt;
      ev.rts = newAgdata.rts;
      ev.rfg = newAgdata.rfg;
      ev.mi = newAgdata.mi;
      ev.tb = newAgdata.tb;
      await this.sqlExce.updateByParam(ev);
      //事件对象放入返回事件
      Object.assign(outAgd,ev);

      outAgd.tos = tos;//需要发送的参与人

      outAgds.push(outAgd);

      // 删除相关提醒
      let wa = new WaTbl();
      wa.obi = oriAgdata.evi;//obi使用原evi
      wa.obt = anyenum.ObjectType.Event;
      sqlparam.push(wa.dTParam());

      //提醒新建
      if (newAgdata.txjson.reminds && newAgdata.txjson.reminds.length > 0) {
        sqlparam = [...sqlparam , ...this.sqlparamAddTxWa(ev, newAgdata.st, newAgdata.al, newAgdata.txjson)];
      }

      //如果当前更新对象是父节点，则为当前重复日程重建新的父记录，值为ev表里的第一条做为父记录
      await this.operateForParentAgd(oriAgdata,newAgdata.parters,newAgdata.fjs,sqlparam,outAgds);

      //日程表新建或更新,修改为独立日的也需要为自己创建对应的日程
      let caparam = new CaTbl();
      caparam = this.sqlparamAddCa(oriAgdata.evi ,newAgdata.evd,newAgdata.evd,newAgdata);//evi使用原evi
      sqlparam.push(caparam.rpTParam());

      //变化或新增的日程放入事件对象
      Object.assign(outAgd,caparam);



    }

    await this.sqlExce.batExecSqlByParam(sqlparam);

    return outAgds;

  }

  /**
   * 如果当前单一对象是父事件，则为当前重复事件重建新的父事件，值为ev表重复记录里的第一条做为父事件
   * @param {AgendaData} oriAgdata
   * @param {Array<Parter>} parters
   * @param {Array<FjTbl>} fjs
   * @param {Array<any>} sqlparam
   * @param {DUflag} doflag
   * @returns {Promise<void>}
   */
  private async operateForParentAgd(oriAgdata : AgendaData,
                                      parters : Array<Parter>,
                                      fjs : Array<FjTbl>,
                                      sqlparam : Array<any>,
                                      outAgds : Array<AgendaData>){
    let sq : string ;

    let outAgd = {} as AgendaData;
    let nwEvs = Array<EvTbl>();
    let nwEv = new EvTbl();

    let tos : string;//需要发送的参与人手机号
    tos = this.getParterPhone(parters);

    let upcondi :string ;
    let upAgds = new Array<AgendaData>();//保存修改的事件用

    if (!oriAgdata.rtevi && oriAgdata.rtevi =="" && oriAgdata.rfg == anyenum.RepeatFlag.Repeat){
      sq = `select * from gtd_ev where rtevi = '${oriAgdata.evi}' and  rfg = '${anyenum.RepeatFlag.Repeat}'
         and del <>  '${anyenum.DelType.del}' order by evd ;`;

      nwEvs = await this.sqlExce.getExtList<EvTbl>(sq);
      if (nwEvs != null && nwEvs.length >0){
        //更新首条为父事件
        Object.assign(nwEv, nwEvs[0]);
        nwEv.rtevi = "";
        nwEv.tb = anyenum.SyncType.unsynch;
        nwEv.mi = UserConfig.account.id;
        await this.sqlExce.updateByParam(nwEv);

        //原子事件的父字段改为新的父事件
        upcondi = ` rtevi = '${oriAgdata.evi}' `
        sq = `update gtd_ev set rtevi = '${nwEv.evi}',mi='${UserConfig.account.id}',tb = '${anyenum.SyncType.unsynch}'
             where  ${upcondi}; `;
        await this.sqlExce.execSql(sq);

        //上记标记为修改的记录放入返回事件中
        sq = ` select *, '${tos}' as tos from gtd_ev where ${upcondi} ; `
        upAgds = await this.sqlExce.getExtLstByParam<AgendaData>(sq,[]);

        //为新的父事件建立新的对应日程
        let nwca = new CaTbl();
        nwca = this.sqlparamAddCa(nwEv.evi ,nwEv.evd,oriAgdata.ed,oriAgdata);
        sqlparam.push(nwca.rpTParam());

        //复制原参与人到新的父事件
        let nwpar = new Array<any>();
        nwpar = this.sqlparamAddPar(nwEv.evi , parters);

        //复制原附件到新的父事件
        let nwfj = new Array<any>();
        nwfj = this.sqlparamAddFj(nwEv.evi , fjs);

        sqlparam = [...sqlparam, ...nwpar, ...nwfj];

        //新的父事件放入返回事件
        Object.assign(outAgd, nwEv);
        //把新日程放入返回事件的父事件中
        Object.assign(outAgd , nwca);
        //复制原参与人放入返回事件的父事件中
        outAgd.parters = parters;
        //复制原附件放入返回事件的父事件中
        outAgd.fjs = fjs;

        outAgd.tos = tos;//需要发送的参与人


        outAgds.push(outAgd);

        outAgds = [...outAgds ,...upAgds];
      }
    }
  }

  /**
   * 删除原事件中从当前开始所有事件
   * @param {string} masterEvi
   * @param {AgendaData} oriAgdata
   * @param {Array<Parter>} parters
   * @param {Array<any>} sqlparam
   * @param {Array<AgendaData>} outAgds
   * @returns {Promise<void>}
   */
  private async delFromsel(masterEvi : string ,
                           oriAgdata : AgendaData ,
                           parters : Array<Parter>,
                           sqlparam : Array<any>,
                           outAgds : Array<AgendaData>){
    let delAgds = new Array<AgendaData>();//保存删除的事件用
    let delcondi :string ;

    let tos : string;//需要发送的参与人手机号
    tos = this.getParterPhone(parters);

    let sq : string ;
    //删除原事件中从当前开始所有事件 evd使用原事件evd
    delcondi = ` evd >= '${oriAgdata.evd}' and (evi = '${masterEvi}' or rtevi =  '${masterEvi}') `
    sq = `update  gtd_ev set del ='${anyenum.DelType.del}' , mi ='${UserConfig.account.id}',tb = '${anyenum.SyncType.unsynch}'
        where ${delcondi} ;`;
    await this.sqlExce.execSql(sq);

    //上记标记为删除的记录放入返回事件中
    sq = ` select * from gtd_ev where ${delcondi} ; `;
    delAgds = await this.sqlExce.getExtLstByParam<AgendaData>(sq,[]);

    //更新原事件日程结束日或事件表无记录了则删除
    sq = `select * from gtd_ev where (evi = '${masterEvi}' or rtevi =  '${masterEvi}') and del <> '${anyenum.DelType.del}'
      order by evd  ;`;
    let evtbls = new Array<AgendaData>();
    evtbls = await this.sqlExce.getExtLstByParam<AgendaData>(sq ,[]);


    let caevi : string = masterEvi;
    let ca = new CaTbl();
    ca.evi = caevi;
    let existca = await this.sqlExce.getOneByParam<CaTbl>(ca);
    Object.assign(ca, existca);

    if (evtbls.length > 0){//有数据，需要更新日程结束日
      ca.ed = moment(oriAgdata.evd).subtract(1,'d').format("YYYY/MM/DD");//evd使用原事件evd
      sqlparam.push(ca.upTParam());

      //日程信息修改了，把日程信息复制到事件父信息内，并把父记录放入返回事件
      for (let j = 0 ,len = evtbls.length ; j < len ; j++){
        if (evtbls[j].rtevi == "" && evtbls[j].evi == ca.evi){
          Object.assign(evtbls[j],ca);

          evtbls[j].tos = tos;//需要发送的参与人

          outAgds.push(evtbls[j]);
          break;
        }
      }

    }else{//无数据，需要删除关联表数据
      sqlparam.push(ca.dTParam());

      //本地删除事件参与人
      let par: ParTbl = new ParTbl();
      par.obt = anyenum.ObjectType.Event;
      par.obi = masterEvi;
      par.del = anyenum.DelType.del;
      par.tb = anyenum.SyncType.unsynch;
      sqlparam.push(par.upTParam());

      //本地删除附件
      let fj: FjTbl = new FjTbl();
      fj.obt = anyenum.ObjectType.Event;
      fj.obi = masterEvi;
      fj.del = anyenum.DelType.del;
      fj.tb = anyenum.SyncType.unsynch;
      sqlparam.push(fj.upTParam());

      //删除原事件中从当前事件开始所有提醒 evd使用原事件evd
      sq = `delete from gtd_wa where obt = '${anyenum.ObjectType.Event}' and  obi in (select evi from gtd_ev
          where evd >= '${oriAgdata.evd}' and (evi = '${masterEvi}' or rtevi =  '${masterEvi}')
           and  del ='${anyenum.DelType.del}' ); `;
      sqlparam.push(sq);

      //取得所有删除的参与人
      let delpars = new Array<Parter>();
      let delpar = new  ParTbl();
      delpar.obt = anyenum.ObjectType.Event;
      delpar.obi = masterEvi;
      delpars = await this.sqlExce.getLstByParam<Parter>(delpar);

      //取得所有删除的附件
      let delfjs = new Array<FjTbl>();
      let delfj = new  FjTbl();
      delfj.obt = anyenum.ObjectType.Event;
      delfj.obi = masterEvi;
      delfjs = await this.sqlExce.getLstByParam<FjTbl>(delfj);

      //把删除的日程信息、参与人、附件复制到删除的事件父信息内
      for (let j = 0 ,len = delAgds.length ; j < len ; j++){
        if (delAgds[j].rtevi == "" && delAgds[j].evi == ca.evi){
          Object.assign(delAgds[j],ca);
          delAgds[j].parters = delpars;
          delAgds[j].fjs = delfjs;

          delAgds[j].tos = tos;//需要发送的参与人
          break;
        }
      }
    }
    outAgds = [...outAgds, ...delAgds];
  }

  /**
   * 获取参与人手机号
   * @param {Array<Parter>} parters
   * @returns {Array<string>}
   */
  private getParterPhone(parters : Array<Parter>): string{

    let ret : Array<string> = [];
    if (!parters || parters == null) {
      return "";
    }
    for (let j = 0,len = parters.length; j < len ; j++){
      ret.push(parters[j].rc);
    }
    return ret.join(",");
  }

  /**
   * 创建附件
   * @param {string} evi
   * @param {Array<FjTbl>} fjs
   * @returns {Array<any>}
   */
  private sqlparamAddFj(evi : string ,fjs : Array<FjTbl>):Array<any>{
    let ret = new Array<any>();
    if (!fjs && fjs.length > 0){
      for (let j = 0 ,len = fjs.length;j < len ; j++){
        let fj = new FjTbl();
        fj.fji = this.util.getUuid();
        fj.obt = anyenum.ObjectType.Event;
        fj.obi = evi;
        fj.fjn = fj[j].fjn;
        fj.ext = fj[j].ext;
        fj.fj = fj[j].fj;
        fj.tb = anyenum.SyncType.unsynch;
        fj.del = anyenum.DelType.undel;
        ret.push(fj.inTParam());
      }
    }
    return ret;
  }

  /**
   * 创建参与人
   * @param {string} evi
   * @param {Array<Parter>} pars
   * @returns {Array<any>}
   */
  private sqlparamAddPar(evi : string ,pars : Array<Parter>):Array<any>{
    let ret = new Array<any>();
    if (!pars && pars.length > 0){
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
        ret.push(par.inTParam());
      }
    }
    return ret;
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

  private sqlparamAddEv2(agdata: AgendaData): RetParamEv {

    let ret = new RetParamEv();
    let outAgds = new Array<AgendaData>();

    //字段evt 设定
    if (agdata.al == anyenum.IsWholeday.Whole){
      agdata.evt = "00:00";
    }else{
      agdata.evt = agdata.st;
    }

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
        this.assertNotNumber(rtjson.over.value);   // 结束条件不能为数字字符串以外的值
        repeatTimes = (Number(rtjson.over.value) > 0)? Number(rtjson.over.value) : 1;
        break;
      case anyenum.OverType.limitdate :
        this.assertEmpty(rtjson.over.value);    // 结束条件不能为空
        repeatEndDay = moment(rtjson.over.value).add(1,'days').format("YYYY/MM/DD");
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
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes * repeatStep, "days").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.week :
        repeatType = "weeks";
        options = rtjson.openway || options;
        repeatTimes = repeatTimes || moment(repeatStartDay).add(2, "years").diff(repeatStartDay, "weeks");
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes * repeatStep, "weeks").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.month :
        repeatType = "months";
        options = rtjson.openway || options;
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
        if (txjson.reminds && txjson.reminds.length > 0) {
          ret.sqlparam = [...ret.sqlparam ,...this.sqlparamAddTxWa(ev,agdata.st,agdata.al,txjson)];
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
  private sqlparamAddTxWa(ev: EvTbl,st:string,al: string, txjson :TxJson ): Array<any> {
    let ret = new Array<any>();
    if (txjson.reminds && txjson.reminds.length > 0) {
      for ( let j = 0, len = txjson.reminds.length ;j < len ; j++){

        let wa = new WaTbl();//提醒表
        let remind : anyenum.RemindTime;

        wa.wai = this.util.getUuid();
        wa.obt = anyenum.ObjectType.Event;
        wa.obi = ev.evi;
        remind = txjson.reminds[j];

        wa.st = ev.evn;
        let time = parseInt(remind);
        let date;
        if (al == anyenum.IsWholeday.NonWhole) {
          date = moment(ev.evd + " " + st).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

        } else {
          date = moment(ev.evd + " " + "08:00").subtract(time, 'm').format("YYYY/MM/DD HH:mm");

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
   * 日程新增sql list
   * @param {string} rtevi
   * @param {string} sd
   * @param {string} ed
   * @param {AgendaData} agdata
   * @returns {Array<any>}
   */
  private sqlparamAddCa(rtevi : string,sd : string ,ed :string, agdata : AgendaData): CaTbl {

    agdata.sd = sd;
    agdata.ed = ed;
    if (agdata.al == anyenum.IsWholeday.Whole){
      agdata.st = "00:00";
      agdata.et = "23:59";
    }else{
      //不是全天，结束时间通过时长计算
      if (agdata.et == ""){
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
      }else{
        //结束时间不为空，则算时长
        let ct = moment(agdata.ed + " " + agdata.et).diff(agdata.ed + " " + agdata.st, 'm');
        agdata.ct = ct;
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
    ca.et = agdata.et;

    return ca;
  }

	/**
	 * 创建更新任务
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
			let sqlparam = new Array<any>();
			let retParamTaskData = new RetParamTaskData();
			retParamTaskData = this.sqlparamAddTaskData(task);
			sqlparam = [...retParamTaskData.sqlparam];
      await this.sqlExce.batExecSqlByParam(sqlparam);
		}

    this.emitService.emit("mwxing.calendar.activities.changed", task);

		return task;
  }

	private sqlparamAddTaskData(taskData: TaskData): RetParamTaskData {

    let ret = new RetParamTaskData();
    let outTasks = new Array<TaskData>();

    //字段evt 设定
   	taskData.evt = taskData.evt||"23:59";

    let rtjson: RtJson = taskData.rtjson;
    taskData.rt = JSON.stringify(taskData.rtjson);

    if (rtjson.cycletype == anyenum.CycleType.close){

      taskData.rfg = anyenum.RepeatFlag.NonRepeat;
    }else{

      taskData.rfg = anyenum.RepeatFlag.Repeat;
    }

    let txjson : TxJson  = taskData.txjson;
    taskData.tx = JSON.stringify(taskData.txjson);

    // 开始日期
    let repeatStartDay: string = taskData.evt;
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
		let days: Array<string> = new Array<string>();
		//获取重复日期
		days = this.getOutDays(rtjson,repeatStartDay,repeatType ,repeatStep,options,repeatTimes,repeatEndDay);
		for(let day of days) {
	  
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
		  	ret.sqlparam = [...ret.sqlparam ,...this.sqlparamAddTaskWa(ev,anyenum.ObjectType.Memo,txjson)];
	  	}
	    //创建任务SQL
	     ret.sqlparam.push(this.sqlparamAddTaskTt(ev,taskData.cs, taskData.isrt))
	    //新增数据需要返回出去
	    let task2 = {} as TaskData;
	    Object.assign(task2,ev);
	    outTasks.push(task2);
		}
  	ret.outTasks = outTasks;
  	return ret;
  }

	// 获取循环的时间
	private getOutDays(rtjson : RtJson, repeatStartDay: string,repeatType: moment.unitOfTime.DurationConstructor ,repeatStep: number, options: Array<number>, repeatTimes: number,repeatEndDay: string) : Array<string> {
		
		let days: Array<string> = new Array<string>();
		   // 根据结束类型设置重复次数/结束日期
    switch(rtjson.over.type) {
      case anyenum.OverType.times :
        this.assertEmpty(rtjson.over.value);    // 结束条件不能为空
        this.assertNotNumber(rtjson.over.value);   // 结束条件不能为数字字符串以外的值
        repeatTimes = (Number(rtjson.over.value) > 0)? Number(rtjson.over.value) : 1;
        break;
      case anyenum.OverType.limitdate :
        this.assertEmpty(rtjson.over.value);    // 结束条件不能为空
        repeatEndDay = moment(rtjson.over.value).add(1,'days').format("YYYY/MM/DD");
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
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes * repeatStep, "days").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.week :
        repeatType = "weeks";
        options = rtjson.openway || options;
        repeatTimes = repeatTimes || moment(repeatStartDay).add(2, "years").diff(repeatStartDay, "weeks");
        repeatEndDay = repeatEndDay || moment(repeatStartDay).add(repeatTimes * repeatStep, "weeks").format("YYYY/MM/DD");
        break;
      case anyenum.CycleType.month :
        repeatType = "months";
        options = rtjson.openway || options;
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
        this.assertFail();    // 预期外值, 程序异常
    }

    let stepDay: string = repeatStartDay;

    // 循环开始日期 ~ 结束日期
    while (moment(stepDay).isBefore(repeatEndDay)) {
    		
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
	          this.assertFail();    // 预期外值, 程序异常
	        }
	      } else {
	        // 普通重复
	        days.push(stepDay);
	      }
	       stepDay = moment(stepDay).add(repeatStep, repeatType).format("YYYY/MM/DD");
      }
    
    	let daysNew : Array<string> = new Array<string>(); 
    	for(let day of days )
    	{
    		if (moment(day).isBefore(repeatEndDay)) {
    			daysNew.push(day);
    		}
    	}
      return daysNew;
	}


	/**
   *获取提醒表sql
   * @param {EvTbl}
   * @param {ev: EvTbl,st:string ,sd:string,txjson :TxJson }
   * @returns {ETbl}
   */
  private sqlparamAddTaskWa(ev: EvTbl,obtType: string, txjson :TxJson, al: string = "" ,st:string=""): Array<any> {
    let ret = new Array<any>();
    if (txjson.reminds && txjson.reminds.length > 0) {
      for ( let j = 0, len = txjson.reminds.length ;j < len ; j++) {
        let wa = new WaTbl();//提醒表
        let remind : anyenum.RemindTime;
        wa.wai = this.util.getUuid();
        wa.obt = obtType;
        wa.obi = ev.evi;
        remind = txjson.reminds[j];
        wa.st = ev.evn;
        let time = parseInt(remind);
       let date;
        if (al == anyenum.IsWholeday.NonWhole) {
          date = moment(ev.evd + " " + st).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

        } else {
          date = moment(ev.evd + " " + "08:00").subtract(time, 'm').format("YYYY/MM/DD HH:mm");

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
  private sqlparamAddTaskTt(ev: EvTbl,cs: string, isrt : string ): TTbl {
    //创建任务
		let ttdb: TTbl = new TTbl();
		ttdb.evi = ev.evi;
		ttdb.cs = cs || anyenum.IsSuccess.wait;
		ttdb.isrt = isrt || anyenum.IsCreate.isNo;
		ttdb.cd = moment().format('YYYY/MM/DD');
    return ttdb;
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
			let evdb: EvTbl = new EvTbl();
			Object.assign(evdb, minitask);
			await this.sqlExce.saveByParam(evdb);
		}

    this.emitService.emit("mwxing.calendar.activities.changed", minitask);

		return minitask;
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
		pull.d.push(evi);
		await this.dataRestful.pull(pull);
		return;
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
  async syncTask(tt: TaskData) {

  	this.assertEmpty(tt);       // 入参不能为空
	  this.assertEmpty(tt.evi);    // ID不能为空
	  this.assertEmpty(tt.del);   // 删除标记不能为空

	  let push: PushInData = new PushInData();
	  let sync: SyncData = new SyncData();
	  sync.id = tt.evi;
    sync.type = "Task";
    sync.security = SyncDataSecurity.None;
    sync.status = SyncDataStatus[tt.del];
    sync.payload = tt;
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

}

//画面传入事件service参数体
export interface AgendaData extends EventData, CaTbl {

  //重复设定
  rtjson :RtJson;
  //提醒设定
  txjson :TxJson;
  //参与人
  parters : Array<Parter>;
  //计划
  jha : JhaTbl;
  //发起人
  originator: Parter;

  //附件
  fjs : Array<FjTbl>;

  //用于数据上传给服务器时，给哪些参与人，[]无参与人或参与人被全删
  tos : string;

}

export interface  Parter extends ParTbl{

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

export interface TaskData extends EventData,TTbl {
	//重复设定
  rtjson :RtJson;
  //提醒设定
  txjson :TxJson;
  //参与人
  parters : Array<Parter>;
  //发起人
  originator: Parter;

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
  parters : Array<Parter>;
  //发起人
  originator: Parter;

  //附件
  fjs : Array<FjTbl>;

  //用于数据上传给服务器时，给哪些参与人，[]无参与人或参与人被全删
  tos : string;
}

export class RetParamEv{
  rtevi:string ="";
  ed:string = "";
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
  value:string;
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
}

export class TxJson {
  reminds = new Array<anyenum.RemindTime>();
}

enum DUflag {
  del = "del",
  update = "update"
}

export class OutDate {
	days: Array<string> = new Array<string>,
	repeatEndDay: string 
}
