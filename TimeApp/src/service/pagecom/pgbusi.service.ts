//获取日程
import {CTbl} from "../sqlite/tbl/c.tbl";
import {ETbl} from "../sqlite/tbl/e.tbl";
import {JhTbl} from "../sqlite/tbl/jh.tbl";
import {AgdPro, AgdRestful} from "../restful/agdsev";
import {Injectable} from "@angular/core";
import {SqliteExec} from "../util-service/sqlite.exec";
import {UtilService} from "../util-service/util.service";
import {SpTbl} from "../sqlite/tbl/sp.tbl";
import {DTbl} from "../sqlite/tbl/d.tbl";
import * as moment from "moment";
import {DataConfig} from "../config/data.config";
import {UserConfig} from "../config/user.config";
import {ContactsService} from "../cordova/contacts.service";
import {BaseData, FsData, JtData, RcInParam, ScdData, SpecScdData,MonthData} from "../../data.mapping";
import {FsService} from "../../pages/fs/fs.service";
import {EmitService} from "../util-service/emit.service";
import {BTbl} from "../sqlite/tbl/b.tbl";
import {JtTbl} from "../sqlite/tbl/jt.tbl";
import {CalendarDay, CalendarMonth} from "../../components/ion2-calendar/calendar.model";
import {NotificationsService} from "../cordova/notifications.service";
import {LocalcalendarService} from "../cordova/localcalendar.service";

@Injectable()
export class PgBusiService {
  constructor(private sqlExce: SqliteExec, private util: UtilService, private agdRest: AgdRestful,
              private contactsServ: ContactsService, private userConfig: UserConfig, private fsService: FsService,private emitService:EmitService
    ,private notificationsService:NotificationsService,private readlocal:LocalcalendarService
  ) {
  }

  /**
   * 未读消息更新已读状态
   * @param {string} si
   */
  updateMsg(si: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      let sql = 'update gtd_sp set itx = 0 where si="' + si + '"';
      await this.sqlExce.execSql(sql);
      sql = 'update gtd_c set du = "0" where si="' + si + '"';
      await this.sqlExce.execSql(sql);

      this.notificationsService.badgeDecrease();
      this.emitService.emitRef(si);
      resolve();
    });
  }

  /**
   * 日程保存或日程更新  dch
   */
  saveOrUpdate(rc : RcInParam):Promise<ScdData>{
    return new Promise<ScdData>(async (resolve, reject) => {
      if (rc.si != null && rc.si !="") {
        let scd = new ScdData();
        Object.assign(scd, rc);

        //设置sp表值
        let sp :SpecScdData =new SpecScdData();
        Object.assign(sp,rc.specScdUpd);
        scd.specScds.set(sp.sd,sp);
        scd.showSpSd = sp.sd;
        scd = await this.updateDetail(scd);

        resolve(scd)
      } else {
        rc.setParam();
        rc.ui = UserConfig.account.id;
        let scd = new ScdData();
        Object.assign(scd, rc);
        scd = await this.save(scd);
        resolve(scd)
      }
    })
  }

  /**
   * 批量保存日程更新  dch
   */
  async saveBatch(rcL : Array<RcInParam>){
    let sqL = new Array<string>();
    let len = sqL.length;
    if(rcL.length>0){
      for(let rc of rcL){
        let rcn = new CTbl();
        rc.setParam();
        Object.assign(rcn,rc);
        rcn.si = this.util.getUuid();
        rcn.ui = UserConfig.account.id;
        sqL.push(rcn.inT());
        if(rc.gs == '3'){
          let jt = new JtTbl();
          Object.assign(jt,rc);
          jt.si = rcn.si;
          jt.jti = this.util.getUuid();
          sqL.push(jt.inT());
        }else{
          let sp = new SpTbl();
          Object.assign(sp,rc);
          sp.spi = this.util.getUuid();
          sp.si = rcn.si;
          sqL.push(sp.inT());
        }
      }
      if(sqL.length>0){
        len = await this.sqlExce.batExecSql(sqL);
      }
    }
    return len;
  }

  /**
   * 根据日程Id获取日程详情  dch
   * @param {string} si
   */
  getRcBySi(si:string): Promise<ScdData> {
    return new Promise<ScdData>(async (resolve, reject) => {
      //获取本地日程
      let scdData = new ScdData();
      let ctbl = await this.getCtbl(si);
      if(ctbl != null){
        Object.assign(scdData, ctbl);
        //获取计划对应色标
        let jh = new JhTbl();
        jh.ji = scdData.ji;
        jh = await this.sqlExce.getOne<JhTbl>(jh);
        Object.assign(scdData.p, jh);
        //获取特殊日程子表详情
        if(scdData.gs != '3'){
          scdData.specScds = await this.getSpData('',scdData.si,'');
        }else{
          scdData.specScds = await this.getJtData('',scdData.si,'');
        }
        if(scdData.gs == '0'){
          //共享人信息
          scdData.fss = await this.getFsDataBySi(ctbl.si);
        }

        if(scdData.gs == '1'){
          //发起人信息
          scdData.fs = await this.getFsDataByUi(ctbl.ui);
        }
        if(scdData.si == ''){
          resolve(null);
        }else{
          resolve(scdData);
        }

      }
    });
  }
  /**
   * 根据(日程Id和日期)获取日程详情  dch
   * @param {string} si  日程Id
   * @param {string} date 日期
   */
  getRcBySiAndSd(si:string,sd:string): Promise<ScdData> {
    return new Promise<ScdData>(async (resolve, reject) => {
      let scdData = new ScdData();
      //传si和date
      scdData = await this.getRcBySi(si);
      if (scdData != null) {
        scdData.baseData = scdData.specScd(sd);
      }
      if(scdData.si == ''){
        resolve(null);
      }else{
        resolve(scdData);
      }
    })
  }

  /**
   * 根据子表ID查询日程
   * @param {string} subSi 子表ID
   */
  getRcBySubSi(subSi:string): Promise<ScdData> {
    return new Promise<ScdData>(async (resolve, reject) => {
      let scdData = new ScdData();
      scdData.specScds = await this.getSpData(subSi,'','');
      if(scdData.specScds.size>0){
        scdData.specScds.forEach((value) => {
          let sp:SpecScdData = new SpecScdData();
          Object.assign(sp,value);
          scdData.si = sp.si;
          scdData.showSpSd = sp.sd;
        });
      }else{
        scdData.specScds = await this.getJtData(subSi,'','');
        scdData.specScds.forEach((value) => {
          let sp:JtData = new JtData();
          Object.assign(sp,value);
          scdData.si = sp.si;
          scdData.showSpSd = sp.sd;
        });
      }
      if(scdData.si != '') {
        scdData = await this.getRcBySi(scdData.si);
        scdData.baseData = scdData.specScd(scdData.showSpSd);
        resolve(scdData);
      }else{
        resolve(null);
      }
    })
  }

  /**
   * 根据日程所属ID查询日程
   * @param {string} sr 日程所属ID
   * @returns {Promise<ScdData>}
   */
  getRcBySr(sr: string): Promise<ScdData> {
    return new Promise<ScdData>(async (resolve, reject) => {
      //获取本地日程
      let scdData = new ScdData();
      let ctbl = new CTbl();
      if (sr && sr != "") {
        ctbl.sr = sr;
      }
      ctbl = await this.sqlExce.getOne<CTbl>(ctbl);
      if(ctbl != null){
        scdData = await this.getRcBySi(ctbl.si)
      }
      if(scdData != null && scdData.si != ''){
        resolve(scdData);
      }else{
        resolve(null);
      }
    })
  }

  /**
   * 条件查询  dch
   * @param {RcInParam} rc
   */
  getList(rc : RcInParam): Promise<Array<ScdData>> {
    return new Promise<Array<ScdData>>(async resolve => {
      console.log("============ mq查询日程scd："+ JSON.stringify(rc));
      let res: Array<ScdData> = new Array<ScdData>();
      if (rc.ed ||rc.et ||rc.sd ||rc.st || rc.sn || rc.fss.length>0) {
        let sql: string = `select * from (
                           select distinct c.si,c.sn,c.ui,c.st,c.ed,c.et,c.rt,c.ji,c.sr,c.tx,c.pni,c.du,c.gs,
                           sp.spn,sp.sd,sp.st,c.bz
                           from gtd_sp sp inner join gtd_c c on sp.si = c.si
                                    left join gtd_d d on d.si = c.si 
                                    left join gtd_b b on b.pwi = d.ai`;
        if(rc.fss.length>0){
          sql = sql + 'where b.ranpy in (';
          for(let i=0;i<rc.fss.length;i++){
            if(i== rc.fss.length-1){
              sql = sql + '"' +rc.fss[i].ranpy+'"';
            }else{
              sql = sql + '"' +rc.fss[i].ranpy+'",';
            }
          }
          sql = sql +') ';
          sql = sql + ' or b.rnpy in (';
          for(let i=0;i<rc.fss.length;i++){
            if(i== rc.fss.length-1){
              sql = sql + '"' +rc.fss[i].rnpy+'"';
            }else{
              sql = sql + '"' +rc.fss[i].rnpy+'",';
            }
          }
          sql = sql +') ';
        }
        sql = sql + ` union
        select  c.si,c.sn,c.ui,c.st,c.ed,c.et,c.rt,c.ji,c.sr,c.tx,c.pni,c.du,c.gs,
          jt.spn,jt.sd,jt.st,jt.bz
        from gtd_jt jt inner join gtd_c c on jt.si = c.si)`;

        if (rc.sn) {
          sql = sql + ` and (sn like '% ${rc.sn}%' or bz like '% ${rc.sn}%')`;
        }
        if (rc.sd) {
          sql = sql + ` and sd >= '${rc.sd}'`;
        } else {
          sql = sql + ` and sd >= '${moment().subtract(30, 'd').format('YYYY/MM/DD')}%'`;
        }
        if (rc.ed) {
          sql = sql + ` and sd <= '${rc.ed}'`;
        } else {
          sql = sql + ` and sd <= '${moment().add(30, 'd').format('YYYY/MM/DD')}%'`;
        }
        if (rc.st) {
          sql = sql + ` and st >= '${rc.st}'`;
        }
        if (rc.et) {
          sql = sql + ` and st <= '${rc.et}'`;
        }
        console.log("============ mq查询日程："+ sql);
        res = await this.sqlExce.getExtList<ScdData>(sql);
      }
      resolve(res);
    })
  }

  /**
   * 首页月份查询  dch
   * @param {CalendarMonth} month
   */
  async getHomeMonthData(month:CalendarMonth):Promise<Array<MonthData>> {
    return new Promise<Array<MonthData>>(async (resolve, reject) => {
      let _start = new Date(month.original.time);
      let _startMonth = moment(moment(_start).format("YYYY/MM/") + "1");
      let _endMonth = moment(moment(_start).format("YYYY/MM/") + _startMonth.daysInMonth());
      let sql:string = `select jt.spn,jt.si,jt.minpx,gc.sd csd,sp.sd,count(*) scds,sum(itx) news,min(gc.rt) minrt
      from gtd_c gc join gtd_sp sp on gc.si = sp.si left join (select sd,jti,spn,si,min(px) minpx  
      from gtd_jt group by sd) jt on jt.sd = sp.sd where sp.sd>='${moment(_startMonth).format("YYYY/MM/DD")}'  
      and sp.sd<='${moment(_endMonth).format("YYYY/MM/DD")}' group by sp.sd ,gc.sd;`;
      let list = await this.sqlExce.getExtList<MonthData>(sql);

      // //本地日历加入主页日历显示中
      // let local = await this.readlocal.findEventRc('',_startMonth,_endMonth);
      // for(let lo of local){
      //   let md:MonthData = data.find((n) => moment(lo.sd).isSame(moment(n.sd), 'day'));
      //   if (md){
      //     md.scds = md.scds + 1;
      //   }else{
      //     md = new MonthData();
      //     md.sd=lo.sd;
      //     md.scds=1;
      //     md.news=0;
      //     list.push(md);
      //   }
      // }
      resolve(list);
    })
  }

  /**
   * 一览查询  dch
   * @param {string} d 日期
   * @param {number} action 0:next , 1
   * @param {number} count
   */
  getRcYL(d:string,action:number,count:number){

  }
  /**
   * MQ删除日程
   */
  pullDel(srId: string): Promise<CTbl> {
    return new Promise<any>(async (resolve, reject) => {
      let ctbl: CTbl = new CTbl();
      //日程Id
      ctbl.sr = srId;
      ctbl = await this.sqlExce.getOne<CTbl>(ctbl);

      await this.delRcBySi(ctbl.si);

      this.emitService.emitRef(srId);

      resolve(ctbl);

    });

  }

  /**
   * 根据日程ID删除  dch
   * @param {string} si 日程ID删除
   */
  async delRcBySi(si:string){
    let ctbl: CTbl = new CTbl();
    //日程Id
    ctbl.si = si;
    let etbl: ETbl = new ETbl();
    etbl.si = ctbl.si;
    await this.sqlExce.delete(etbl);//本地删除提醒
    let dtbl: DTbl = new DTbl();
    dtbl.si = ctbl.si;
    await this.sqlExce.delete(dtbl);//本地删除日程参与人

    await this.sqlExce.delete(ctbl); //本地删除日程表

    let sptbl = new SpTbl();
    sptbl.si = si;
    await this.sqlExce.delete(sptbl);//本地删除日程子表

    //restFul 删除日程
    let a: AgdPro = new AgdPro();
    a.ai = ctbl.si;//日程ID
    await this.agdRest.remove(a);
    this.emitService.emitRef(si);
    return true;
  }

  /**
   *  删除开始时间以后的日程   dch
   * @param {string} si 日程ID
   * @param {string} sd 开始时间
   */
  async delRcBySiAndSd(si:string,sd:string){
    let ctbl: CTbl = new CTbl();
    //日程Id
    ctbl.si = si;
    let sql1 = "delete from gtd_e where si = '" + si + "' and " +
      " wi in (select spi from gtd_sp where si = '" + si + "' and sd>= '" + sd + "') ";
    await this.sqlExce.execSql(sql1);//本地删除提醒表

    let sql = "delete from gtd_sp where si = '" + si + "' and sd>= '" + sd + "'";
    await this.sqlExce.execSql(sql);//本地删除日程子表

    let ed = moment(sd).subtract(1, 'd').format("YYYY/MM/DD");
    ctbl.ed = ed;
    ctbl.bz = null;
    await this.sqlExce.update(ctbl);//更新日程表

    let a = new AgdPro();
    a.ai = ctbl.si;//日程ID
    a.ed = ed;
    await this.agdRest.save(a);
    this.emitService.emitRef(si);
    return true;
  }

  /**
   *  根据计划ID删除日程   dch
   * @param {string} ji 计划ID
   * @param {number} type 计划类型 0:自定义;1系统
   */
  async delRcByJi(ji:string){
    let jh = new JhTbl();
    jh.ji = ji;
    jh = await this.sqlExce.getOne<JhTbl>(jh);
    if(jh != null){
      await this.delRcBySiAndSd(ji,jh.jt);
      return true;
    }
    return false;
  }

  /**
   *  根据计划ID和计划类型删除日程   dch
   * @param {string} ji 计划ID
   * @param {number} jt 计划类型
   */
  async delRcByJiAndJt(ji:string,jt:string){
    let sqls:Array<string> = new Array<string>();
    if(jt == '2'){
      //删除自定义计划
      console.log('---------- PdService delete 删除计划开始 ----------------');
      // 本地计划日程关联
      //修改日程表 计划 ji 去除
      sqls.push('update gtd_c set ji = null where ji = "' + ji + '";');
      //修改日程表 计划 ji 去除
      sqls.push('update gtd_sp set ji = null where ji = "' + ji + '";');
      // 删除计划
      sqls.push('delete from gtd_j_h where ji = "' + ji + '";');
      await this.sqlExce.batExecSql(sqls);
      console.log('---------- PdService delete 删除计划结束 ----------------');
    }else{
      //删除系统计划
      console.log('---------- PlService delete 删除系统计划开始 ----------------');
      if(jt == "1"){
        // 删除日程附件表
        sqls.push('delete from gtd_sp where ji = "' + ji + '";');
      }else if(jt == "0"){
        //删除系统特殊计划日程数据
        sqls.push('delete from gtd_jt where ji = "' + ji + '";');
      }
      //删除日程表
      sqls.push('delete from gtd_c where ji = "' + ji + '";');

      //计划 jtd 修改
      sqls.push('update gtd_j_h set jtd = null where ji = "' + ji + '";');

      await this.sqlExce.batExecSql(sqls);
      console.log('---------- PlService delete 删除系统计划结束 ----------------');
    }
    return true;
  }

  /**
   * 获取系统计划3特殊表详情  dch
   * @param {string} jti
   * @param {string} si
   * @returns {Promise<Array<JtData>>}
   */
  private async getJtData(jti:string,si:string,sd:string){
    let baseL = new Map<string, BaseData>();
    let jt = new JtTbl();
    jt.px = null;
    if(jti != ''){
      jt.jti = jti;
    }
    if(si != ''){
      jt.si = si;
    }
    if(sd != ''){
      jt.sd = sd;
    }
    let jtL = await this.sqlExce.getList<JtData>(jt);
    for (let j = 0, len = jtL.length; j < len; j++) {
      baseL.set(jtL[j].sd, jtL[j]);
    }
    return baseL;
  }

  /**
   * 获取日程特殊表详情  dch
   * @param {string} spi
   * @param {string} si
   * @param {string} sd
   * @returns {Promise<Array<JtData>>}
   */
  private async getSpData(spi:string,si:string,sd:string){
    let baseL = new Map<string, BaseData>();
    //获取特殊日程子表及提醒对象
    let spsql = "select sp.spi, " +
      "sp.si," +
      "sp.spn," +
      "sp.sd," +
      "sp.st," +
      "sp.ed," +
      "sp.et," +
      "sp.ji," +
      "sp.bz," +
      "sp.sta," +
      "sp.tx," +
      "sp.wtt," +
      "sp.itx ,e.wi ewi,e.si esi,e.st est ,e.wd ewd,e.wt ewt,e.wtt ewtt " +
      " from gtd_sp sp left join gtd_e e on sp.spi = e.wi and " +
      "sp.si = e.si  where 1=1 ";
    if(si != ''){
      spsql =spsql +  "and sp.si = '" + si + "' "
    }
    if(sd != ''){
      spsql =spsql +  "and sp.sd = '" + sd + "' "
    }
    if(spi != ''){
      spsql =spsql +  "and sp.spi = '" + spi + "' "
    }
    let lst: Array<any> = new Array<any>();
    lst = await this.sqlExce.getExtList<any>(spsql);
    for (let j = 0, len = lst.length; j < len; j++) {
      let sp: SpecScdData = new SpecScdData();
      Object.assign(sp, lst[j]);

      sp.remindData.wi = lst[j].ewi;
      sp.remindData.si = lst[j].esi;
      sp.remindData.st = lst[j].est;
      sp.remindData.wd = lst[j].ewd;
      sp.remindData.wt = lst[j].ewt;
      sp.remindData.wtt = lst[j].ewtt;
      baseL.set(sp.sd, sp);
    }
    return baseL;
  }

  /**
   * 根据日程Id获取联系人信息  dch
   * @returns {Promise<Array<FsData>>}
   */
  private async getFsDataBySi(si:string){
    let fss: Array<FsData> =new Array<FsData>();
    //共享人信息
    let dlst: Array<DTbl> = new Array<DTbl>();
    let dlstsql = "select * from gtd_d where si = '" + si + "' ";
    dlst = await this.sqlExce.getExtList<DTbl>(dlstsql);
    for (let j = 0, len = dlst.length; j < len; j++) {
      let fs: FsData = new FsData();
      fs = this.userConfig.GetOneBTbl(dlst[j].ai);
      if(fs && fs != null){
        fss.push(fs);
      }
    }
    return fss;
  }

  /**
   * 根据用户Id获取联系人信息  dch
   * @returns {Promise<Array<FsData>>}
   */
  private async getFsDataByUi(ui:string){
    let fs = new FsData();
    //发起人信息
    let tmp = this.userConfig.GetOneBTbl(ui);
    if (tmp) {
      fs = tmp;
    }else{
      //不存在查询数据库
      let b = await this.getBtcl(ui);
      if(b != null){
        Object.assign(fs, b);
        fs.bhiu = DataConfig.HUIBASE64;
      }else{
        console.error("=======PgbusiService 获取发起人失败 =======")
      }
    }
    return fs;
  }

  /**
   * 根据openId查询联系人信息  dch
   * @param ui
   * @returns {Promise<BTbl>}
   */
  private async getBtcl(ui){
    //不存在查询数据库
    let b = new BTbl();
    b.ui = ui;
    b = await this.sqlExce.getExtOne<BTbl>(b.slT());
    return b;
  }

  /**
   * 获取ctbl表信息  dch
   * @param si
   */
  private async getCtbl(si){
    let c = new CTbl();
    c.si = si;
    c = await this.sqlExce.getOne<CTbl>(c);
    return c;
  }
  /**
   * 日程添加
   * @param {PageRcData} rc 日程信息
   * @returns {Promise<BsModel<any>>}
   */
  save(rc: ScdData): Promise<ScdData> {

    return new Promise<ScdData>(async (resolve, reject) => {
      let str = this.checkRc(rc);
      //TODO  返回错误信息
      if (str != '') {
        return null;
      }
      let ct = new CTbl();
      Object.assign(ct, rc);
      ct.si = this.util.getUuid();
      //添加特殊事件表
      let data = await this.saveSp(ct);
      if (data && data != '') {
        ct.ed = data;
        ct.et = ct.st;
      }
      //保存本地日程
      if (!ct.ui) ct.ui = ct.si;
      if (!ct.st) ct.st = this.util.adToDb("");
      await this.sqlExce.save(ct)

      let adgPro: AgdPro = new AgdPro();
      //restFul保存日程
      this.setAdgPro(adgPro, ct);
      this.agdRest.save(adgPro);

      Object.assign(rc,ct);
      resolve(rc);

      this.emitService.emitRef(ct.sd);
    });

  }


  /**
   * 日程添加
   * @param {PageRcData} rc 日程信息
   * @returns {Promise<BsModel<any>>}
   */
  save4ai(rc: ScdData): Promise<ScdData> {


    return new Promise<ScdData>(async (resolve, reject) => {
      let ct: ScdData = await this.save(rc);
      rc.si = ct.si;
      this.fsService.sharefriend(ct.si, rc.fss);
      resolve(rc);
      return;
    });
  }

  /**
   * 保存日程特殊表
   * @param {CTbl} rc 日程详情
   * @returns {Promise<Promise<any> | number>}
   */
  private saveSp(rc: CTbl): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      let len = 1;
      let add: any = 'd';
      if (rc.rt == '1') {
        len = 365;
      } else if (rc.rt == '2') {
        len = 96;
        add = 'w';
      } else if (rc.rt == '3') {
        len = 24;
        add = 'M';
      } else if (rc.rt == '4') {
        len = 20;
        add = 'y';
      }
      let sql = new Array<string>();
      let ed = ''
      for (let i = 0; i < len; i++) {
        let sp = new SpTbl();
        sp.spi = this.util.getUuid();
        sp.si = rc.si;
        // sp.sd = moment(rc.sd).add(i,'d').format("YYYY/MM/DD");
        sp.sd = moment(rc.sd).add(i, add).format("YYYY/MM/DD");
        sp.st = rc.st;
        sp.tx = rc.tx;
        sp.ji = rc.ji;
        sp.spn = rc.sn;
        sp.bz = rc.bz;
        sp.ed = sp.sd;
        sp.et = sp.st;
        ed = sp.sd;
        //新消息提醒默认加到第一条上
        if (i == 0 && rc.gs == '1') {
          sp.itx = 1;
        }
        sql.push(sp.inT());
        if (sp.tx > '0') {
          sql.push(this.getTxEtbl(sp).rpT());
        }
      }

      console.log('-------- 插入重复表 --------');
      //保存特殊表
      await this.sqlExce.batExecSql(sql);
      resolve(ed);
      return;
    });

  }

  /**
   *获取提醒表sql
   * @param {CTbl} rc 日程详情
   * @param {string} tsId 特殊表Id
   * @returns {Promise<Promise<any> | number>}
   */
  private getTxEtbl(sp: SpTbl): ETbl {
    let et = new ETbl();//提醒表
    et.si = sp.si;
    et.wi = sp.spi;
    if (sp.tx != '0') {
      et.st = sp.spn;
      let time = 10; //分钟
      if (sp.tx == "2") {
        time = 30;
      } else if (sp.tx == "3") {
        time = 60;
      } else if (sp.tx == "4") {
        time = 240;
      } else if (sp.tx == "5") {
        time = 1440;
      }
      let date;
      if (!this.util.isAday(sp.st)) {
        date = moment(sp.sd + " " + sp.st).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

      } else {
        date = moment(sp.sd + " " + "08:00").subtract(time, 'm').format("YYYY/MM/DD HH:mm");

      }
      et.wd = moment(date).format("YYYY/MM/DD");
      et.wt = moment(date).format("HH:mm");
      console.log('-------- 插入提醒表 --------');

    }

    return et;
  }

  /**
   * 日程校验
   * @param {PageRcData} rc
   * @returns {string}
   */
  private checkRc(rc: ScdData): string {
    let str = '';
    //check 日程必输项
    if (rc.sn == '') {
      str += '标题不能为空;/n';
    }
    if (rc.sn.length > 200) {
      str += '标题文本长度必须下于20;/n';
    }
    if (rc.sd == '') {
      str += '日期不能为空;/n';
    }
    return str;
  }


//修改本地日程详情
  /**
   *
   * @param {ScdData} scd
   * @returns {Promise<void>}
   */
  updateDetail(scd: ScdData): Promise<ScdData> {
    return new Promise<ScdData>(async (resolve, reject) => {
      //特殊表操作
      let oldc: CTbl = new CTbl();
      oldc.si = scd.si;
      oldc = await this.sqlExce.getOne<CTbl>(oldc);

      //更新日程
      let c = new CTbl();
      Object.assign(c, scd);
      //消息设为已读
      //c.du = "0";


      if (oldc.sd != scd.sd || oldc.rt != scd.rt) {
        //日期与重复标识变化了，则删除重复子表所有数据，重新插入新数据
        let sptbl = new SpTbl();
        sptbl.si = c.si;
        //删除提醒
        let sql = 'delete from gtd_e  where si="' + c.si + '"';
        await this.sqlExce.execSql(sql);
        //删除特殊表
        await this.sqlExce.delete(sptbl);
        //保存特殊表及相应提醒表
        let ed = await this.saveSp(c);
        //结束日期使用sp表最后日期
        c.ed = ed;

      } else {
        //更新子表数据
        //if (oldc.st != c.st || oldc.tx != c.tx) {

        //更新sp日程表title
        let sq = "update gtd_sp set spn = '" + c.sn + "' where si = '" + c.si + "'";
        await this.sqlExce.execSql(sq);

        //更新e表title
        sq = "update gtd_e set st = '" + c.sn + "' where si = '" + c.si + "'";
        await this.sqlExce.execSql(sq);

        //受邀人pull则不更新sp
        if (scd.specScd(scd.showSpSd)){
          let sp:SpTbl = new SpTbl();
          Object.assign(sp,scd.specScd(scd.showSpSd));
          await this.sqlExce.update(sp);


          //保存提醒表
          let sq2 = "";
          if (sp.tx !="0" ){
            sq2 = this.getTxEtbl(sp).rpT();
          }else{
            sq2 = this.getTxEtbl(sp).dT();
          }
          await this.sqlExce.execSql(sq2);
        }

        //}

      }
      await this.sqlExce.update(c);
      if(c.rt=="0" || (c.rt != "0" && c.sn != oldc.sn)){
        //restful用参数
        let agd = new AgdPro();
        this.setAdgPro(agd, c);
        await this.agdRest.save(agd);
      }
      this.emitService.emitRef(scd.sd);
      resolve(scd);
    });

  }

  // //获取计划列表
  // getPlans(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     //获取本地计划列表
  //     let jhtbl: JhTbl = new JhTbl();
  //     jhtbl.jt = "2";
  //     this.sqlExce.getList<JhTbl>(jhtbl).then(data => {
  //       resolve(data)
  //     }).catch(error => {
  //       resolve(error)
  //     })
  //   });
  // }

  private setAdgPro(agd: AgdPro, c: CTbl) {
    //关联日程ID
    agd.rai = c.sr;
    //日程发送人用户ID
    agd.fc = c.ui;
    //日程ID
    agd.ai = c.si;
    //主题
    agd.at = c.sn;
    //时间(YYYY/MM/DD)
    agd.adt = c.sd;
    agd.st = c.st;
    agd.ed = c.ed;
    agd.et = c.et;
    //计划
    agd.ap = c.ji;
    //重复
    agd.ar = c.rt;
    //提醒
    agd.aa = c.tx;
    //备注
    agd.am = c.bz;
  }

  //响应MQ消息，从服务器获取最新日程
  pullAgd(sr: string): Promise<ScdData> {
    return new Promise<ScdData>(async (resolve, reject) => {

      let agd = new AgdPro();
      agd.ai = sr;
      agd = await this.agdRest.get(agd);

      let c = new CTbl();
      c.sr = sr;
      c = await this.sqlExce.getOne<CTbl>(c);
      let newc = new CTbl();
      //新消息总是未读
      newc.du = "1";
      if (c == null) {
        //插入日程表
        this.setCtbl(newc, agd);
        //设置本地日程ID
        newc.si = this.util.getUuid();
        //设置关联日程ID
        newc.sr = sr;

        //添加特殊事件表
        let ed = await this.saveSp(newc);
        //结束日期使用sp表最后日期
        newc.ed = ed;
        await this.sqlExce.save(newc);

        //保存受邀人日程到服务器
        let a = new AgdPro();
        this.setAdgPro(a, newc);
        await this.agdRest.save(a);

      } else {

        //更新日程表
        this.setCtbl(newc, agd);

        //拉下来的重复日程不变且为重复日程，结束日少于原来的结束日，则为部分日程删除动作
        if (newc.rt == c.rt && c.rt !="0" && newc.ed < c.ed ){
          await  this.delRcBySiAndSd(c.si,moment(newc.ed).add(1, 'd').format("YYYY/MM/DD"));
        }else{
          //更新日程
          //设置本地日程ID
          newc.si = c.si;
          //设置关联日程ID
          newc.sr = sr;
          //本地日程的备注和提醒不被更新
          newc.bz = c.bz;
          newc.tx = c.tx;

          let scdData = new ScdData();

          Object.assign(scdData, newc);

          //修改特殊事件表
          await this.updateDetail(scdData);
        }

      }

      //获取当前日程详情及相关内容
      let ret = new ScdData();
      ret = await this.getRcBySr(sr);

      //刷新联系人，联系人存在判断 不存在获取更新 ，刷新本地缓存
      let fs: FsData = new FsData();
      fs = this.userConfig.GetOneBTbl(newc.ui);
      if (fs) {
        ret.fs = fs;
      } else {
        //从服务器获取对象，放入本地库，刷新缓存
        ret.fs = await this.contactsServ.updateOneFs(newc.ui);
      }

      resolve(ret);

      return ret;

    });

  }

  private setCtbl(c: CTbl, agd: AgdPro) {
    //关联日程ID
    c.sr = agd.rai ? agd.rai : "";
    //日程发送人用户ID
    c.ui = agd.fc;
    //日程ID
    c.si = agd.ai;
    //主题
    c.sn = agd.at;

    //计划
    if (agd.ap == null || !agd.ap){
      c.ji = "";
    }else{
      c.ji = agd.ap;
    }

    //重复
    c.rt = agd.ar;

    //时间(YYYY/MM/DD)
    let adt = agd.adt.split(" ");
    c.sd = adt[0];
    c.ed = agd.ed;

    if (adt.length == 1) {
      //全天
      c.st = this.util.adToDb("");
      c.et = this.util.adToDb("");
    } else {
      c.st = adt[1];
      c.et = adt[1];
    }

    //提醒
    c.tx = agd.aa;
    //备注
    if (agd.am == null || !agd.am){
      c.bz = "";
    }else{
      c.bz = agd.am;
    }

    //他人创建
    c.gs = "1";
    //新消息未读
    //c.du = "0";
  }

  /**
   * 获取分享日程的参与人
   * @param {string} calId 日程ID
   * @returns {Promise<Array<FsData>>}
   */
  getCalfriend(calId: string): Promise<Array<FsData>> {
    return new Promise<Array<FsData>>((resolve, reject) => {
      let sql = 'select gd.pi,gd.si,gb.*,bh.hiu bhiu from gtd_d gd inner join gtd_b gb on gb.pwi = gd.ai left join gtd_bh bh on gb.pwi = bh.pwi where si="' + calId + '"';
      let fsList = new Array<FsData>();
      console.log('---------- getCalfriend 获取分享日程的参与人 sql:' + sql);
      this.sqlExce.execSql(sql).then(data => {
        if (data && data.rows && data.rows.length > 0) {
          for (let i = 0, len = data.rows.length; i < len; i++) {
            let fs = new FsData();
            Object.assign(fs, data.rows.item(i));
            if (!fs.bhiu || fs.bhiu == null || fs.bhiu == '') {
              fs.bhiu = DataConfig.HUIBASE64;
            }
            fsList.push(fs);
          }
        }
        console.log('---------- getCalfriend 获取分享日程的参与人结果:' + fsList.length/*JSON.stringify(fsList)*/);
        resolve(fsList);
      }).catch(e => {
        console.error('---------- getCalfriend 获取分享日程的参与人出错:' + e.message);
        resolve(fsList);
      })
    })
  }

  /**
   * 日程创建人信息
   * @param {string} calId
   * @returns {Promise<FsData>}
   */
  getCrMan(calId: string): Promise<FsData> {

    return new Promise<FsData>((resolve, reject) => {
      let sql = 'select c.si,gb.*,bh.hiu bhiu from gtd_c c ' +
        ' inner join gtd_b gb on gb.rc = c.ui ' +
        ' left join gtd_bh bh on gb.pwi = bh.pwi where c.si="' + calId + '"';
      let fs = new FsData();

      this.sqlExce.execSql(sql).then(data => {
        if (data && data.rows && data.rows.length > 0) {

          Object.assign(fs, data.rows.item(0));
          if (!fs.bhiu || fs.bhiu == null || fs.bhiu == '') {
            fs.bhiu = DataConfig.HUIBASE64;
          }

        }
        resolve(fs);
      }).catch(e => {
        resolve(fs);
      })
    })
  }
}
