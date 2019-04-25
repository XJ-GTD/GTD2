import {Injectable} from "@angular/core";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {BackupPro, BacRestful, OutRecoverPro, RecoverPro} from "../../service/restful/bacsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {SpTbl} from "../../service/sqlite/tbl/sp.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
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

@Injectable()
export class BrService {
  constructor(private bacRestful: BacRestful, private sqlexec: SqliteExec,
              private util: UtilService,private contactsServ :ContactsService) {

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
    let csql = "select * from gtd_c where ji not in (select ji from gtd_j_h where jt ='1') ";//系统计划的日程不备份
    backupPro.d.c = await this.sqlexec.getExtList<CTbl>(csql);
    //restFul上传
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.c) backupPro.d.c.length = 0;//清空数组 以防其他表备份时候此数据再被上传


    //获取特殊日历
    let spsql = "select sp.* from gtd_sp sp inner join " +
      " ( select * from gtd_c where ji not in (select ji from gtd_j_h where jt ='1')) c on c.si = sp.si ";//系统计划的日程不备份
    backupPro.d.sp = await this.sqlexec.getExtList<SpTbl>(spsql);
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.sp) backupPro.d.sp.length = 0;


    //获取提醒数据
    let e = new ETbl();
    backupPro.d.e = await this.sqlexec.getList<ETbl>(e);
    await this.bacRestful.backup(backupPro);
    if (backupPro.d.e) backupPro.d.e.length = 0;

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
    let jhsql = "select * from  gtd_j_h where jt <> '1' "//系统计划不备份
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
    let spsql ="delete from gtd_sp where si not in " +
      " (select si from gtd_c where ji in (select ji from gtd_j_h where jt ='1')) ";
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
    let csql = "delete from gtd_c where ji not in (select ji from gtd_j_h where jt ='1'  ) ";
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
    let jhsql = "delete from gtd_j_h where jt <> '1' ";//本地系统计划不删除
    await this.sqlexec.execSql(jhsql);

    for (let j = 0, len = outRecoverPro.jh.length; j < len; j++) {
      let jhi = new JhTbl();
      Object.assign(jhi,outRecoverPro.jh[j]) ;
      sqls.push(jhi.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;


    //插入用户偏好（插入前删除）
    let y = new YTbl();
    await this.sqlexec.delete(y);

    for (let j = 0, len = outRecoverPro.y.length; j < len; j++) {
      let yi = new YTbl();
      Object.assign(yi,outRecoverPro.y[j]) ;
      sqls.push(yi.inT());
    }
    await this.sqlexec.batExecSql(sqls);
    sqls.length = 0;

    //联系人的更新信息操作
    await this.contactsServ.updateFs();

    return ;
  }
}


export class PageBrDataPro {
  //画面时间戳
  bts: string = "";

  //页面时间
  dt: string = "";
}
