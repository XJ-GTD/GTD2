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

@Injectable()
export class BrService {
  constructor(private bacRestful: BacRestful, private sqlexec: SqliteExec,
              private util: UtilService) {

  }

  //备份方法，需要传入页面 ，画面显示备份进度条
  async backup() {
    //定义上传信息JSSON List

    let backupPro: BackupPro = new BackupPro();
    //操作账户ID
    backupPro.oai = "a13661617252"
    //操作手机号码
    backupPro.ompn = "13661617252";
    //时间戳
    backupPro.d.bts = 0;

    //获取本地日历
    let c = new CTbl();
    backupPro.d.c = await this.sqlexec.getList<CTbl>(c);

    //获取特殊日历
    let sp = new SpTbl();
    backupPro.d.sp = await this.sqlexec.getList<SpTbl>(sp);

    //获取提醒数据
    let e = new ETbl();
    backupPro.d.e = await this.sqlexec.getList<ETbl>(e);

    //获取日程参与人数据
    let d = new DTbl();
    backupPro.d.d = await this.sqlexec.getList<DTbl>(d);

    //获取联系人信息
    let b = new BTbl();
    backupPro.d.b = await this.sqlexec.getList<BTbl>(b);

    //获取群组信息
    let g = new GTbl();
    backupPro.d.g = await this.sqlexec.getList<GTbl>(g);

    //获取群组人员信息
    let bx = new BxTbl();
    backupPro.d.bx = await this.sqlexec.getList<BxTbl>(bx);

    //获取本地计划
    let jh = new JhTbl();
    backupPro.d.jh = await this.sqlexec.getList<JhTbl>(jh);

    //获取用户偏好
    let u = new UTbl();
    backupPro.d.u = await this.sqlexec.getList<UTbl>(u);

    //test
    let s = new STbl();
    backupPro.d.s = await this.sqlexec.getList<STbl>(s);

    //restFul上传
    await this.bacRestful.backup(backupPro);

    let ret = new BsModel();
    ret.code = 0;
    return ret;
  }

  //页面获取最后更新时间
  getLastDt(): Promise<BsModel<PageBrDataPro>> {
    //restFul 获取服务器 日历条数
    return new Promise((resolve, reject) => {
      let bsModel = new BsModel<PageBrDataPro>();
      this.bacRestful.getlastest().then(data => {
        bsModel.data = new PageBrDataPro();
        bsModel.data.bts = data.data.bts;
        bsModel.data.dt = this.util.tranDate(bsModel.data.bts, "yyyy/MM/dd hh:mm")
        resolve(bsModel)
      })
    })
  }

  //恢复
  async recover(bts: Number) {

    let bsModel = new BsModel<OutRecoverPro>();

    let recoverPro: RecoverPro = new RecoverPro();
    //操作账户ID
    recoverPro.oai = "a13661617252"
    //操作手机号码
    recoverPro.ompn = "13661617252";
    recoverPro.d.bts = bts;
    // 设定恢复指定表
    // recoverPro.d.rdn=[];
    bsModel = await this.bacRestful.recover(recoverPro);
    //插入本地日历（插入前删除）
    let c = new CTbl();
    await this.sqlexec.delete(c);

    for (let j = 0, len = bsModel.data.c.length; j < len; j++) {
      let ci = new CTbl();
      ci.si = bsModel.data.c[j].si;
      ci.sn = bsModel.data.c[j].sn;
      ci.ui = bsModel.data.c[j].ui;
      ci.sd = bsModel.data.c[j].sd;
      ci.st = bsModel.data.c[j].st;
      ci.ed = bsModel.data.c[j].ed;
      ci.et = bsModel.data.c[j].et;
      ci.rt = bsModel.data.c[j].rt;
      ci.ji = bsModel.data.c[j].ji;
      ci.sr = bsModel.data.c[j].sr;
      ci.bz = bsModel.data.c[j].bz;
      await this.sqlexec.save(ci);
    }

    //插入特殊日历（插入前删除）
    let sp = new SpTbl();
    await this.sqlexec.delete(sp);

    for (let j = 0, len = bsModel.data.sp.length; j < len; j++) {
      let spi = new SpTbl();
      spi.spi = bsModel.data.sp[j].spi;
      spi.si  = bsModel.data.sp[j].si ;
      spi.spn = bsModel.data.sp[j].spn;
      spi.sd  = bsModel.data.sp[j].sd ;
      spi.st  = bsModel.data.sp[j].st ;
      spi.ed  = bsModel.data.sp[j].ed ;
      spi.et  = bsModel.data.sp[j].et ;
      spi.ji  = bsModel.data.sp[j].ji ;
      spi.bz  = bsModel.data.sp[j].bz ;
      spi.sta = bsModel.data.sp[j].sta;
      await this.sqlexec.save(spi);
    }
    //插入提醒数据（插入前删除）
    let e = new ETbl();
    await this.sqlexec.delete(e);

    for (let j = 0, len = bsModel.data.e.length; j < len; j++) {
      let ei = new ETbl();
      ei.wi = bsModel.data.e[j].wi;
      ei.si = bsModel.data.e[j].si;
      ei.st = bsModel.data.e[j].st;
      ei.wd = bsModel.data.e[j].wd;
      ei.wt = bsModel.data.e[j].wt;
      await this.sqlexec.save(ei);
    }

    //插入日程参与人信息（插入前删除）
    let d = new DTbl();
    await this.sqlexec.delete(d);

    for (let j = 0, len = bsModel.data.d.length; j < len; j++) {
      let di = new DTbl();
      di.pi  = bsModel.data.d[j].pi ;
      di.si  = bsModel.data.d[j].si ;
      di.st  = bsModel.data.d[j].st ;
      di.son = bsModel.data.d[j].son;
      di.sa  = bsModel.data.d[j].sa ;
      di.ai  = bsModel.data.d[j].ai ;
      di.ib  = bsModel.data.d[j].ib ;
      di.bi  = bsModel.data.d[j].bi ;
      await this.sqlexec.save(di);
    }

    //插入联系人信息（插入前删除）
    let b = new BTbl();
    await this.sqlexec.delete(b);

    for (let j = 0, len = bsModel.data.b.length; j < len; j++) {
      let bi = new BTbl();
      bi.pwi = bsModel.data.b[j].pwi;
      bi.ran = bsModel.data.b[j].ran;
      bi.ranpy = bsModel.data.b[j].ranpy;
      bi.ri  = bsModel.data.b[j].ri ;
      bi.hiu = bsModel.data.b[j].hiu;
      bi.rn  = bsModel.data.b[j].rn ;
      bi.rnpy = bsModel.data.b[j].rnpy;
      bi.rc  = bsModel.data.b[j].rc ;
      bi.rf  = bsModel.data.b[j].rf ;
      bi.ot  = bsModel.data.b[j].ot ;
      bi.rel = bsModel.data.b[j].rel;
      bi.ui  = bsModel.data.b[j].ui;
      await this.sqlexec.save(bi);
    }
    //插入群组信息（插入前删除）
    let g = new GTbl();
    await this.sqlexec.delete(g);

    for (let j = 0, len = bsModel.data.g.length; j < len; j++) {
      let gi = new GTbl();
      gi.gi = bsModel.data.g[j].gi;
      gi.gn = bsModel.data.g[j].gn;
      gi.gm = bsModel.data.g[j].gm;
      await this.sqlexec.save(gi);
    }
    //插入本地参与人（插入前删除 ）
    let bx = new BxTbl();
    await this.sqlexec.delete(bx);

    for (let j = 0, len = bsModel.data.bx.length; j < len; j++) {
      let bxi = new BxTbl();
      bxi.bi = bsModel.data.bx[j].bi;
      bxi.bmi = bsModel.data.bx[j].bmi;
      await this.sqlexec.save(bxi);
    }
    //插入本地计划（插入前删除）
    let jh = new JhTbl();
    await this.sqlexec.delete(jh);

    for (let j = 0, len = bsModel.data.jh.length; j < len; j++) {
      let jhi = new JhTbl();
      jhi.ji = bsModel.data.jh[j].ji;
      jhi.jn = bsModel.data.jh[j].jn;
      jhi.jg = bsModel.data.jh[j].jg;
      jhi.jc = bsModel.data.jh[j].jc;
      jhi.jt = bsModel.data.jh[j].jt;

      await this.sqlexec.save(jhi);
    }
    //插入用户编好（插入前删除）
    let u = new UTbl();
    await this.sqlexec.delete(u);

    for (let j = 0, len = bsModel.data.u.length; j < len; j++) {
      let ui = new UTbl();
      ui.ui  = bsModel.data.u[j].ui ;
      ui.ai  = bsModel.data.u[j].ai ;
      ui.un  = bsModel.data.u[j].un ;
      ui.hiu = bsModel.data.u[j].hiu;
      ui.biy = bsModel.data.u[j].biy;
      await this.sqlexec.save(ui);
    }

    //插入系统设置（插入前删除）
    let s = new STbl();
    await this.sqlexec.delete(s);

    for (let j = 0, len = bsModel.data.s.length; j < len; j++) {
      let si = new STbl();
      si.si = bsModel.data.s[j].si;
      si.st = bsModel.data.s[j].st;
      si.stn = bsModel.data.s[j].stn;
      si.sn = bsModel.data.s[j].sn;
      si.yk = bsModel.data.s[j].yk;
      si.yv = bsModel.data.s[j].yv;
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
