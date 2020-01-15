import {Injectable} from "@angular/core";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {BackupPro, BacRestful, OutRecoverPro, RecoverPro} from "../../service/restful/bacsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {SpTbl} from "../../service/sqlite/tbl/sp.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {MoTbl} from "../../service/sqlite/tbl/mo.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";
import {ContactsService} from "../../service/cordova/contacts.service";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";
import {EmitService} from "../../service/util-service/emit.service";
import {GrouperService} from "../../service/business/grouper.service";

@Injectable()
export class BrService {
  constructor(private bacRestful: BacRestful, private sqlexec: SqliteExec,
              private util: UtilService, private grouperService :GrouperService,
              private userConfig: UserConfig, private emitService: EmitService) {

  }

  //备份方法，需要传入页面 ，画面显示备份进度条
  async backup() {
    //定义上传信息JSSON List

    let backupPro: BackupPro = new BackupPro();
    //操作账户ID
    backupPro.oai = UserConfig.account.id
    //操作手机号码
    backupPro.ompn = UserConfig.account.phone;
    //时间戳
    backupPro.d.bts = moment().unix();

    //获取本地日历
    let c = new CTbl();
    let csql = "select * from gtd_c where ji not in (select ji from gtd_j_h where jt ='1' or jt='0' )" +
      " and gs <>'2' ";//系统计划的日程不备份
    backupPro.d.c = await this.sqlexec.getExtList<CTbl>(csql);
    //restFul上传
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.c) backupPro.d.c.length = 0;//清空数组 以防其他表备份时候此数据再被上传


    //获取特殊日历
    let spsql = "select * from gtd_sp where ji not in (select ji from gtd_j_h where jt ='1' or jt ='0')" +
      " and si not in (select si from gtd_c where gs = '2' ) ";//系统计划的日程不备份
    backupPro.d.sp = await this.sqlexec.getExtList<SpTbl>(spsql);
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.sp) backupPro.d.sp.length = 0;


    //获取提醒数据
    let e = new ETbl();
    backupPro.d.e = await this.sqlexec.getList<ETbl>(e);
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.e) backupPro.d.e.length = 0;

    //2019/06/06
    //席理加
    //获取备忘表数据
    let mo = new MoTbl();
    backupPro.d.mo = await this.sqlexec.getList<MoTbl>(mo);
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.mo) backupPro.d.mo.length = 0;

    //获取日程参与人数据
    let d = new DTbl();
    backupPro.d.d = await this.sqlexec.getList<DTbl>(d);
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.d) backupPro.d.d.length = 0;


    //获取联系人信息
    let b = new BTbl();
    backupPro.d.b = await this.sqlexec.getList<BTbl>(b);
     await this.bacRestful.backup(backupPro);
    if (backupPro.d.b) backupPro.d.b.length = 0;


    //获取群组信息
    let g = new GTbl();
    backupPro.d.g = await this.sqlexec.getList<GTbl>(g);
     await this.bacRestful.backup(backupPro);
    if (backupPro.d.g) backupPro.d.g.length = 0;



    //获取群组人员信息
    let bx = new BxTbl();
    backupPro.d.bx = await this.sqlexec.getList<BxTbl>(bx);
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.bx) backupPro.d.bx.length = 0;


    //获取本地计划
    let jhsql = "select * from  gtd_j_h where jt <> '1' and jt <>'0' "//系统计划不备份
    backupPro.d.jh = await this.sqlexec.getExtList<JhTbl>(jhsql);
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.jh) backupPro.d.jh.length = 0;


    //最后一次备份前置true
    backupPro.d.commit =true;

    //获取用户偏好
    let y = new YTbl();
    backupPro.d.y = await this.sqlexec.getList<YTbl>(y);
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.y) backupPro.d.y.length = 0;
    return ;
  }

  //页面获取最后更新时间
  getLastDt(): Promise<PageBrDataPro> {
    //restFul 获取服务器 日历条数
    return new Promise((resolve, reject) => {
      this.bacRestful.getlastest().then(data => {
        let pageBrDataPro = new PageBrDataPro();

        if(data){
          pageBrDataPro.bts = data.bts;
          pageBrDataPro.dt = moment(data.bts).format("YYYY-MM-DD HH:mm")
        }
        resolve(pageBrDataPro)
      })
    })
  }

  //恢复
  async recover(bts: Number) {
    let recoverPro: RecoverPro = new RecoverPro();
    //操作账户ID
    recoverPro.oai = UserConfig.account.id;
    //操作手机号码
    recoverPro.ompn = UserConfig.account.phone;
    recoverPro.d.bts = bts;
    // 设定恢复指定表
    // recoverPro.d.rdn=[];
     let outRecoverPro:OutRecoverPro = await this.bacRestful.recover(recoverPro);

    let sqls=new Array<string>();

    //插入特殊日历（插入前删除）
    let spsql ="delete from gtd_sp where ji not in (select ji from gtd_j_h where jt ='1' or jt='0') " +
      " and si not in ( select si from gtd_c where gs ='2' ) ";
    await this.sqlexec.execSql(spsql);

    for (let j = 0, len = outRecoverPro.sp.length; j < len; j++) {
      let spi = new SpTbl();
      Object.assign(spi,outRecoverPro.sp[j]) ;
      sqls.push(spi.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //插入提醒数据（插入前删除）
    let e = new ETbl();
    await this.sqlexec.delete(e);

    for (let j = 0, len = outRecoverPro.e.length; j < len; j++) {
      let ei = new ETbl();
      Object.assign(ei,outRecoverPro.e[j]) ;
      sqls.push(ei.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //2019/06/06
    //席理加
    //插入备忘表数据（插入前删除）
    let mo = new MoTbl();
    await this.sqlexec.delete(mo);

    for (let j = 0, len = outRecoverPro.mo.length; j < len; j++) {
      let moi = new MoTbl();
      Object.assign(moi,outRecoverPro.mo[j]) ;
      sqls.push(moi.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //插入日程参与人信息（插入前删除）
    let d = new DTbl();
    await this.sqlexec.delete(d);

    for (let j = 0, len = outRecoverPro.d.length; j < len; j++) {
      let di = new DTbl();
      Object.assign(di,outRecoverPro.d[j]) ;
      sqls.push(di.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //插入本地日历（插入前删除）
    let csql = "delete from gtd_c where ji not in (select ji from gtd_j_h where jt ='1' or jt='0' ) " +
      " and gs <>'2' ";
    await this.sqlexec.execSql(csql);

    for (let j = 0, len = outRecoverPro.c.length; j < len; j++) {
      let ci = new CTbl();
      Object.assign(ci,outRecoverPro.c[j]) ;
      sqls.push(ci.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //插入联系人信息（插入前删除）
    let b = new BTbl();
    await this.sqlexec.delete(b);

    for (let j = 0, len = outRecoverPro.b.length; j < len; j++) {
      let bi = new BTbl();
      Object.assign(bi,outRecoverPro.b[j]) ;
      sqls.push(bi.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //插入群组信息（插入前删除）
    let g = new GTbl();
    await this.sqlexec.delete(g);

    for (let j = 0, len =outRecoverPro.g.length; j < len; j++) {
      let gi = new GTbl();
      Object.assign(gi,outRecoverPro.g[j]) ;
      sqls.push(gi.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //插入参与人组关系（插入前删除 ）
    let bx = new BxTbl();
    await this.sqlexec.delete(bx);

    for (let j = 0, len = outRecoverPro.bx.length; j < len; j++) {
      let bxi = new BxTbl();
      Object.assign(bxi,outRecoverPro.bx[j]) ;
      sqls.push(bxi.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //插入本地计划（插入前删除）
    let jh = new JhTbl();
    let jhsql = "delete from gtd_j_h where jt <> '1' and jt<>'0' and ji<>'personalcalendar' and ji<>'workcalendar'";//本地系统计划不删除,默认个人/工作日历不删除
    await this.sqlexec.execSql(jhsql);

    for (let j = 0, len = outRecoverPro.jh.length; j < len; j++) {
      let jhi = new JhTbl();
      Object.assign(jhi,outRecoverPro.jh[j]) ;
      if (jhi.ji == 'personalcalendar' || jhi.ji == 'workcalendar') continue;
      sqls.push(jhi.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //插入用户偏好（插入前删除）
    // 备份客户端版本参数和设备ID
    let verYTbl = new YTbl();
    verYTbl.yt = "FI";
    verYTbl.yk = "FI";
    verYTbl = await this.sqlexec.getExtOne<YTbl>(verYTbl.slT());

    let deviceUUIDYTbl = new YTbl();
    deviceUUIDYTbl.yt = "DI";
    deviceUUIDYTbl.yk = "DI";
    deviceUUIDYTbl = await this.sqlexec.getExtOne<YTbl>(deviceUUIDYTbl.slT());

    // 增加版本5个性化参数恢复前备份
    let hasDR = false;
    let drYTbl = new YTbl();
    drYTbl.yt = "DR";
    drYTbl.yk = "DR";
    drYTbl = await this.sqlexec.getExtOne<YTbl>(drYTbl.slT());

    let hasDRP1 = false;
    let drp1YTbl = new YTbl();
    drp1YTbl.yt = "DRP1";
    drp1YTbl.yk = "DRP1";
    drp1YTbl = await this.sqlexec.getExtOne<YTbl>(drp1YTbl.slT());

    let hasDJH = false;
    let djhYTbl = new YTbl();
    djhYTbl.yt = "DJH";
    djhYTbl.yk = "DJH";
    djhYTbl = await this.sqlexec.getExtOne<YTbl>(djhYTbl.slT());

    // 增加项目跟进参数恢复前备份
    // GitHUB参数
    let hasFOGHSECRET = false;
    let foghsecYTbl = new YTbl();
    foghsecYTbl.yt = "FOGHSECRET";
    foghsecYTbl.yk = "FOGHSECRET";
    foghsecYTbl = await this.sqlexec.getExtOne<YTbl>(foghsecYTbl.slT());

    let hasFOGH = false;
    let foghYTbl = new YTbl();
    foghYTbl.yt = "FOGH";
    foghYTbl.yk = "FOGH";
    foghYTbl = await this.sqlexec.getExtOne<YTbl>(foghYTbl.slT());

    let hasFOGHINS = false;
    let foghinsYTbl = new Array<YTbl>();
    let sfoghinsYTbl = new YTbl();
    sfoghinsYTbl.yt = "FOGH_INS";
    foghinsYTbl = await this.sqlexec.getExtList<YTbl>(sfoghinsYTbl.slT());

    let hasFOGHINSSHARE = false;
    let foghinsshareYTbl = new Array<YTbl>();
    let sfoghinsshareYTbl = new YTbl();
    sfoghinsshareYTbl.yt = "FOGH_INS_SHARE";
    foghinsshareYTbl = await this.sqlexec.getExtList<YTbl>(sfoghinsshareYTbl.slT());

    let hasFOGHININS = false;
    let foghininsYTbl = new Array<YTbl>();
    let sfoghininsYTbl = new YTbl();
    sfoghininsYTbl.yt = "FOGHIN_INS";
    foghininsYTbl = await this.sqlexec.getExtList<YTbl>(sfoghininsYTbl.slT());

    let hasFOGHININSFROM = false;
    let foghininsfromYTbl = new Array<YTbl>();
    let sfoghininsfromYTbl = new YTbl();
    sfoghininsfromYTbl.yt = "FOGHIN_INS_FROM";
    foghininsfromYTbl = await this.sqlexec.getExtList<YTbl>(sfoghininsfromYTbl.slT());

    //FIR.IM参数
    let hasFOFIR = false;
    let fofirYTbl = new YTbl();
    fofirYTbl.yt = "FOFIR";
    fofirYTbl.yk = "FOFIR";
    fofirYTbl = await this.sqlexec.getExtOne<YTbl>(fofirYTbl.slT());

    let hasFOFIRINS = false;
    let fofirinsYTbl = new Array<YTbl>();
    let sfofirinsYTbl = new YTbl();
    sfofirinsYTbl.yt = "FOFIR_INS";
    fofirinsYTbl = await this.sqlexec.getExtList<YTbl>(sfofirinsYTbl.slT());

    let hasFOFIRINSSHARE = false;
    let fofirinsshareYTbl = new Array<YTbl>();
    let sfofirinsshareYTbl = new YTbl();
    sfofirinsshareYTbl.yt = "FOFIR_INS_SHARE";
    fofirinsshareYTbl = await this.sqlexec.getExtList<YTbl>(sfofirinsshareYTbl.slT());

    let hasFOFIRININS = false;
    let fofirininsYTbl = new Array<YTbl>();
    let sfofirininsYTbl = new YTbl();
    sfofirininsYTbl.yt = "FOFIRIN_INS";
    fofirininsYTbl = await this.sqlexec.getExtList<YTbl>(sfofirininsYTbl.slT());

    let hasFOFIRININSFROM = false;
    let fofirininsfromYTbl = new Array<YTbl>();
    let sfofirininsfromYTbl = new YTbl();
    sfofirininsfromYTbl.yt = "FOFIRIN_INS_FROM";
    fofirininsfromYTbl = await this.sqlexec.getExtList<YTbl>(sfofirininsfromYTbl.slT());

    let y = new YTbl();
    await this.sqlexec.delete(y);

    for (let j = 0, len = outRecoverPro.y.length; j < len; j++) {
      let yi = new YTbl();
      Object.assign(yi,outRecoverPro.y[j]) ;
      // 忽略备份数据中的客户端版本参数和设备ID,备份的时候不需要过滤这两个数据
      if (yi.yt == "FI" || yi.yk == "FI" || yi.yk == "DI") continue;
      if (yi.yk == "DR") hasDR = true;
      if (yi.yk == "DRP1") hasDRP1 = true;
      if (yi.yk == "DJH") hasDJH = true;
      if (yi.yk == "FOGHSECRET") hasFOGHSECRET = true;
      if (yi.yk == "FOGH") hasFOGH = true;
      if (yi.yt == "FOGH_INS") hasFOGHINS = true;
      if (yi.yt == "FOGH_INS_SHARE") hasFOGHINSSHARE = true;
      if (yi.yt == "FOGHIN_INS") hasFOGHININS = true;
      if (yi.yt == "FOGHIN_INS_FROM") hasFOGHININSFROM = true;
      if (yi.yk == "FOFIR") hasFOFIR = true;
      if (yi.yt == "FOFIR_INS") hasFOFIRINS = true;
      if (yi.yt == "FOFIR_INS_SHARE") hasFOFIRINS = true;
      if (yi.yt == "FOFIRIN_INS") hasFOFIRININS = true;
      if (yi.yt == "FOFIRIN_INS_FROM") hasFOFIRININSFROM = true;

      sqls.push(yi.inT());
    }

    // 恢复客户端版本参数和设备ID
    let bkVerY : YTbl = new YTbl();
    if (verYTbl) {
      Object.assign(bkVerY,verYTbl);
      sqls.push(bkVerY.inT());
    }
    let bkUUIDY : YTbl = new YTbl();
    if (deviceUUIDYTbl) {
      Object.assign(bkUUIDY,deviceUUIDYTbl);
      sqls.push(bkUUIDY.inT());
    }

    // 恢复版本5未备份个性化参数
    if (!hasDR) {
      let bkDRY: YTbl = new YTbl();
      Object.assign(bkDRY, drYTbl);
      sqls.push(bkDRY.inT());
    }

    if (!hasDRP1) {
      let bkDRP1Y: YTbl = new YTbl();
      Object.assign(bkDRP1Y, drp1YTbl);
      sqls.push(bkDRP1Y.inT());
    }

    if (!hasDJH) {
      let bkDJHY: YTbl = new YTbl();
      Object.assign(bkDJHY, djhYTbl);
      sqls.push(bkDJHY.inT());
    }

    //GitHUB参数
    if (!hasFOGHSECRET) {
      let bkFOGHSECRET: YTbl = new YTbl();
      Object.assign(bkFOGHSECRET, foghsecYTbl);
      sqls.push(bkFOGHSECRET.inT());
    }

    if (!hasFOGH) {
      let bkFOGH: YTbl = new YTbl();
      Object.assign(bkFOGH, foghYTbl);
      sqls.push(bkFOGH.inT());
    }

    if (!hasFOGHINS) {
      for (let foghin of foghinsYTbl) {
        let bkFOGHINS: YTbl = new YTbl();
        Object.assign(bkFOGHINS, foghin);
        this.sqlexec.prepareSave(bkFOGHINS);
      }
    }

    if (!hasFOGHINSSHARE) {
      for (let foghinshare of foghinsshareYTbl) {
        let bkFOGHINSSHARE: YTbl = new YTbl();
        Object.assign(bkFOGHINSSHARE, foghinshare);
        this.sqlexec.prepareSave(bkFOGHINSSHARE);
      }
    }

    if (!hasFOGHININS) {
      for (let foghinin of foghininsYTbl) {
        let bkFOGHININS: YTbl = new YTbl();
        Object.assign(bkFOGHININS, foghinin);
        this.sqlexec.prepareSave(bkFOGHININS);
      }
    }

    if (!hasFOGHININSFROM) {
      for (let foghininfrom of foghininsfromYTbl) {
        let bkFOGHININSFROM: YTbl = new YTbl();
        Object.assign(bkFOGHININSFROM, foghininfrom);
        this.sqlexec.prepareSave(bkFOGHININSFROM);
      }
    }

    //FIR.IM参数
    if (!hasFOFIR) {
      let bkFOFIR: YTbl = new YTbl();
      Object.assign(bkFOFIR, fofirYTbl);
      sqls.push(bkFOFIR.inT());
    }

    if (!hasFOFIRINS) {
      for (let fofirin of fofirinsYTbl) {
        let bkFOFIRINS: YTbl = new YTbl();
        Object.assign(bkFOFIRINS, fofirin);
        this.sqlexec.prepareSave(bkFOFIRINS);
      }
    }

    if (!hasFOFIRINSSHARE) {
      for (let fofirinshare of fofirinsshareYTbl) {
        let bkFOFIRINSSHARE: YTbl = new YTbl();
        Object.assign(bkFOFIRINSSHARE, fofirinshare);
        this.sqlexec.prepareSave(bkFOFIRINSSHARE);
      }
    }

    if (!hasFOFIRININS) {
      for (let fofirinin of fofirininsYTbl) {
        let bkFOFIRININS: YTbl = new YTbl();
        Object.assign(bkFOFIRININS, fofirinin);
        this.sqlexec.prepareSave(bkFOFIRININS);
      }
    }

    if (!hasFOFIRININSFROM) {
      for (let fofirininfrom of fofirininsfromYTbl) {
        let bkFOFIRININSFROM: YTbl = new YTbl();
        Object.assign(bkFOFIRININSFROM, fofirininfrom);
        this.sqlexec.prepareSave(bkFOFIRININSFROM);
      }
    }

    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //联系人的更新信息操作
    await this.grouperService.updateFs();

    //刷新缓存数据
    await this.userConfig.RefreshYTbl();
    //await this.userConfig.RefreshFriend();

    // 刷新日历和一览
    this.emitService.emitRef('');

    return ;
  }
}


export class PageBrDataPro {
  //画面时间戳
  bts: string = "";

  //页面时间
  dt: string = "";
}
