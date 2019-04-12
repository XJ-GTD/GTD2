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
import {STbl} from "../../service/sqlite/tbl/s.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {UtilService} from "../../service/util-service/util.service";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";

@Injectable()
export class BrService {
  constructor(private bacRestful: BacRestful, private sqlexec: SqliteExec,
              private util: UtilService) {

  }

  //备份方法，需要传入页面 ，画面显示备份进度条
  async backup() {

    let ret = new BsModel();

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
    ret = await this.bacRestful.backup(backupPro);
    backupPro.d.c.length = 0;//清空数组 以防其他表备份时候此数据再被上传

    if (ret.code = -99) {
      return ret;
    }

    //获取特殊日历
    let sp = new SpTbl();
    backupPro.d.sp = await this.sqlexec.getList<SpTbl>(sp);
    ret = await this.bacRestful.backup(backupPro);
    backupPro.d.sp.length = 0;
    if (ret.code = -99) {
      return ret;
    }

    //获取提醒数据
    let e = new ETbl();
    backupPro.d.e = await this.sqlexec.getList<ETbl>(e);
    ret = await this.bacRestful.backup(backupPro);
    backupPro.d.e.length = 0;

    if (ret.code = -99) {
      return ret;
    }

    //获取日程参与人数据
    let d = new DTbl();
    backupPro.d.d = await this.sqlexec.getList<DTbl>(d);
    ret = await this.bacRestful.backup(backupPro);
    backupPro.d.d.length = 0;

    if (ret.code = -99) {
      return ret;
    }

    //获取联系人信息
    let b = new BTbl();
    backupPro.d.b = await this.sqlexec.getList<BTbl>(b);
    ret = await this.bacRestful.backup(backupPro);
    backupPro.d.b.length = 0;

    if (ret.code = -99) {
      return ret;
    }

    //获取群组信息
    let g = new GTbl();
    backupPro.d.g = await this.sqlexec.getList<GTbl>(g);
    ret = await this.bacRestful.backup(backupPro);
    backupPro.d.g.length = 0;

    if (ret.code = -99) {
      return ret;
    }

    //获取群组人员信息
    let bx = new BxTbl();
    backupPro.d.bx = await this.sqlexec.getList<BxTbl>(bx);
    ret = await this.bacRestful.backup(backupPro);
    backupPro.d.bx.length = 0;

    if (ret.code = -99) {
      return ret;
    }

    //获取本地计划
    let jhsql = "select * from  gtd_j_h where jt <> '1' "//系统计划不备份
    backupPro.d.jh = await this.sqlexec.getExtList<JhTbl>(jhsql);
    ret = await this.bacRestful.backup(backupPro);
    backupPro.d.jh.length = 0;

    if (ret.code = -99) {
      return ret;
    }

    //获取用户偏好
    let u = new UTbl();
    backupPro.d.commit =true;
    backupPro.d.u = await this.sqlexec.getList<UTbl>(u);
    ret = await this.bacRestful.backup(backupPro);
    backupPro.d.u.length = 0;

    if (ret.code = -99) {
      return ret;
    }

    ret.code = 0;
    ret.message="备份完成";
    return ret;
  }

  //页面获取最后更新时间
  getLastDt(): Promise<BsModel<PageBrDataPro>> {
    //restFul 获取服务器 日历条数
    return new Promise((resolve, reject) => {
      let bsModel = new BsModel<PageBrDataPro>();
      this.bacRestful.getlastest().then(data => {
        bsModel.data = new PageBrDataPro();

        if(data && data.data && data.data.bts){
          bsModel.data.bts = data.data.bts;
          bsModel.data.dt = this.util.tranDate(bsModel.data.bts, "YYYY/MM/DD HH:mm")
        }

        resolve(bsModel)
      })
    })
  }

  //恢复
  async recover(bts: Number) {

    let bsModel = new BsModel<OutRecoverPro>();

    let recoverPro: RecoverPro = new RecoverPro();
    //操作账户ID
    recoverPro.oai = UserConfig.account.id;
    //操作手机号码
    recoverPro.ompn = UserConfig.account.phone;
    recoverPro.d.bts = bts;
    // 设定恢复指定表
    // recoverPro.d.rdn=[];
    bsModel = await this.bacRestful.recover(recoverPro);
    //插入本地日历（插入前删除）
    let c = new CTbl();
    await this.sqlexec.delete(c);

    for (let j = 0, len = bsModel.data.c.length; j < len; j++) {
      let ci = new CTbl();
      Object.assign(ci,bsModel.data.c[j]) ;
      await this.sqlexec.save(ci);
    }

    //插入特殊日历（插入前删除）
    let sp = new SpTbl();
    await this.sqlexec.delete(sp);

    for (let j = 0, len = bsModel.data.sp.length; j < len; j++) {
      let spi = new SpTbl();
      Object.assign(spi,bsModel.data.sp[j]) ;
      await this.sqlexec.save(spi);
    }
    //插入提醒数据（插入前删除）
    let e = new ETbl();
    await this.sqlexec.delete(e);

    for (let j = 0, len = bsModel.data.e.length; j < len; j++) {
      let ei = new ETbl();
      Object.assign(ei,bsModel.data.e[j]) ;
      await this.sqlexec.save(ei);
    }

    //插入日程参与人信息（插入前删除）
    let d = new DTbl();
    await this.sqlexec.delete(d);

    for (let j = 0, len = bsModel.data.d.length; j < len; j++) {
      let di = new DTbl();
      Object.assign(di,bsModel.data.d[j]) ;
      await this.sqlexec.save(di);
    }

    //插入联系人信息（插入前删除）
    let b = new BTbl();
    await this.sqlexec.delete(b);

    for (let j = 0, len = bsModel.data.b.length; j < len; j++) {
      let bi = new BTbl();
      Object.assign(bi,bsModel.data.b[j]) ;
      await this.sqlexec.save(bi);
    }
    //插入群组信息（插入前删除）
    let g = new GTbl();
    await this.sqlexec.delete(g);

    for (let j = 0, len = bsModel.data.g.length; j < len; j++) {
      let gi = new GTbl();
      Object.assign(gi,bsModel.data.g[j]) ;
      await this.sqlexec.save(gi);
    }
    //插入本地参与人（插入前删除 ）
    let bx = new BxTbl();
    await this.sqlexec.delete(bx);

    for (let j = 0, len = bsModel.data.bx.length; j < len; j++) {
      let bxi = new BxTbl();
      Object.assign(bxi,bsModel.data.bx[j]) ;
      await this.sqlexec.save(bxi);
    }
    //插入本地计划（插入前删除）
    let jh = new JhTbl();
    await this.sqlexec.delete(jh);

    for (let j = 0, len = bsModel.data.jh.length; j < len; j++) {
      let jhi = new JhTbl();
      Object.assign(jhi,bsModel.data.jh[j]) ;

      await this.sqlexec.save(jhi);
    }
    //插入用户编好（插入前删除）
    let u = new UTbl();
    await this.sqlexec.delete(u);

    for (let j = 0, len = bsModel.data.u.length; j < len; j++) {
      let ui = new UTbl();
      Object.assign(ui,bsModel.data.u[j]) ;
      await this.sqlexec.save(ui);
    }

    //插入系统设置（插入前删除）
    let s = new STbl();
    await this.sqlexec.delete(s);

    for (let j = 0, len = bsModel.data.s.length; j < len; j++) {
      let si = new STbl();
      Object.assign(si,bsModel.data.s[j]) ;
      await this.sqlexec.save(si);
    }

    let ret = new BsModel();
    ret.code = 0
    return ret;
  }
}


export class PageBrDataPro {
  //画面时间戳
  bts: string = "";

  //页面时间
  dt: string = "";
}
