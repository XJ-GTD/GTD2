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
import {FsData, ScdData, SpecScdData} from "../../data.mapping";
import {FsService} from "../../pages/fs/fs.service";

@Injectable()
export class PgBusiService {
  constructor(private sqlExce: SqliteExec, private util: UtilService, private agdRest: AgdRestful,
              private contactsServ: ContactsService, private userConfig: UserConfig, private fsService: FsService
  ) {
  }


  /**
   * 获取日程详情,传入所属ID 查询改日程的全部信息 ，主日程 特殊日程
   * 发起人信息 共享人信息， 闹铃信息 计划信息
   * @param {string} si 日程id
   * @param {string} sr 所属日程id（受邀）
   * @returns {Promise<BsModel<ScdData>>}
   */
  get(si: string, sr?: string): Promise<ScdData> {

    return new Promise<ScdData>(async (resolve, reject) => {
      //获取本地日程
      let scdData = new ScdData();

      let ctbl = new CTbl();
      if (si != "") {
        ctbl.si = si;
      }
      if (sr && sr != "") {
        ctbl.sr = sr;
      }

      ctbl = await this.sqlExce.getOne<CTbl>(ctbl);
      Object.assign(scdData, ctbl);

      //获取计划对应色标
      let jh = new JhTbl();
      jh.ji = scdData.ji;
      jh = await this.sqlExce.getOne<JhTbl>(jh);
      Object.assign(scdData.p, jh);

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
        "sp.wtt," +
        "sp.itx ,e.wi ewi,e.si esi,e.st est ,e.wd ewd,e.wt ewt,e.wtt ewtt " +
        " from gtd_sp sp inner join gtd_e e on sp.spi = e.wi and " +
        "sp.si = e.si and sp.si = '" + ctbl.si + "' ";
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
        scdData.specScds.set(sp.sd, sp);
      }

      //发起人信息
      let crfs: FsData = new FsData();
      crfs.bhiu = DataConfig.HUIBASE64;
      let tmp = this.userConfig.GetOneBTbl(ctbl.ui);
      if (tmp) {
        Object.assign(crfs, tmp);
      }
      scdData.fs = crfs;

      //共享人信息
      let dlst: Array<DTbl> = new Array<DTbl>();
      let dlstsql = "select * from gtd_d where si = '" + ctbl.si + "' ";
      dlst = await this.sqlExce.getExtList<DTbl>(dlstsql);
      for (let j = 0, len = dlst.length; j < len; j++) {
        let fs: FsData = new FsData();
        Object.assign(fs, this.userConfig.GetOneBTbl(dlst[j].ai));
        scdData.fss.push(fs);
      }
      resolve(scdData);
      return;
    });
  }

  /**
   * 未读消息更新已读状态
   * @param {string} si
   */
  updateMsg(si: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      let sql = 'update gtd_sp set itx = 0 where si="' + si + '"';
      return this.sqlExce.execSql(sql);
    });
  }

//删除日程 type：1 删除当前以后所有 ，2 删除所有
  delete(rcId: string, type: string, d: string): Promise<CTbl> {
    return new Promise<any>(async (resolve, reject) => {
      let ctbl: CTbl = new CTbl();
      //日程Id
      ctbl.si = rcId;

      if (type == "2") {
        let etbl: ETbl = new ETbl();
        etbl.si = ctbl.si;
        await this.sqlExce.delete(etbl);//本地删除提醒
        let dtbl: DTbl = new DTbl();
        dtbl.si = ctbl.si;
        await this.sqlExce.delete(dtbl);//本地删除日程参与人

        await this.sqlExce.delete(ctbl); //本地删除日程表

        let sptbl = new SpTbl();
        sptbl.si = rcId;
        await this.sqlExce.delete(sptbl);//本地删除日程子表

        //restFul 删除日程
        let a: AgdPro = new AgdPro();
        a.ai = ctbl.si;//日程ID
        await this.agdRest.remove(a);

      } else {

        let sql1 = "delete from gtd_e where si = '" + rcId + "' and " +
          " wi in (select spi from gtd_sp where si = '" + rcId + "' and sd>= '" + d + "') ";
        await this.sqlExce.execSql(sql1);//本地删除提醒表

        let sql = "delete from gtd_sp where si = '" + rcId + "' and sd>= '" + d + "'";
        await this.sqlExce.execSql(sql);//本地删除日程子表

        let ed = moment(d).subtract(1, 'd').format("YYYY/MM/DD");
        ctbl.ed = ed;
        ctbl.bz = null;
        await this.sqlExce.update(ctbl);//更新日程表

        let a = new AgdPro();
        a.ai = ctbl.si;//日程ID
        a.ed = ed;
        await this.agdRest.save(a);
        resolve(ctbl);
        return;
      }
    });


  }

  /**
   * 日程添加
   * @param {PageRcData} rc 日程信息
   * @returns {Promise<BsModel<any>>}
   */
  save(rc: ScdData): Promise<CTbl> {

    return new Promise<CTbl>(async (resolve, reject) => {
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
      if (!ct.st) ct.st = "99:99";
      await this.sqlExce.save(ct)

      let adgPro: AgdPro = new AgdPro();
      //restFul保存日程
      this.setAdgPro(adgPro, ct);
      this.agdRest.save(adgPro);
      resolve(ct);
      return;
    });

  }


  /**
   * 日程添加
   * @param {PageRcData} rc 日程信息
   * @returns {Promise<BsModel<any>>}
   */
  save4ai(rc: ScdData): Promise<ScdData> {


    return new Promise<ScdData>(async (resolve, reject) => {
      let ct: CTbl = await this.save(rc);
      rc.si = ct.si;
      let fs: Array<FsData> = new Array<FsData>();
      for (let f of rc.fss) {
        let ff: FsData = new FsData();
        ff.ui = f.ui;
        ff.rc = f.rc;
        ff.rn = f.rn;
      }
      this.fsService.sharefriend(ct.si, fs);
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
          sql.push(this.getTxEtbl(rc, sp).rpT());
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
  getTxEtbl(rc: CTbl, sp: SpTbl): ETbl {
    let et = new ETbl();//提醒表
    et.si = rc.si;
    if (rc.tx != '0') {
      et.wi = sp.spi;
      et.st = rc.sn;
      let time = 10; //分钟
      if (rc.tx == "2") {
        time = 30;
      } else if (rc.tx == "3") {
        time = 60;
      } else if (rc.tx == "4") {
        time = 240;
      } else if (rc.tx == "5") {
        time = 1440;
      }
      let date;
      if (rc.st != "99:99") {
        date = moment(sp.sd + " " + rc.st).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

      } else {
        date = moment(sp.sd + " " + "08:00").subtract(time, 'm').format("YYYY/MM/DD HH:mm");

      }
      et.wd = moment(date).format("YYYY/MM/DD");
      et.wt = moment(date).format("HH:mm");
      console.log('-------- 插入提醒表 --------');
      return et;
    }
    return null;
  }

  /**
   * 保存更新指定特殊表提醒方式
   * @param {CTbl} r 日程详情
   * @returns {Promise<Promise<any> | number>}
   */
  saveOrUpdTx(c: CTbl): Promise<CTbl> {
    return new Promise<CTbl>(async (resolve, reject) => {
      let condi: SpTbl = new SpTbl();
      condi.si = c.si;
      let sps: Array<SpTbl> = new Array<SpTbl>();
      let sqls: Array<string> = new Array<string>();
      sps = await this.sqlExce.getList<SpTbl>(condi);
      if (c.tx != '0') {
        for (let j = 0, len = sps.length; j < len; j++) {
          let sp: SpTbl = new SpTbl();
          sp = sps[j];
          sqls.push(this.getTxEtbl(c, sp).rpT());
        }
      }
      await this.sqlExce.batExecSql(sqls);
      resolve(c);
      return;
    });


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
      c.du = "1";


      if (oldc.sd != c.sd || oldc.rt != c.rt) {
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
        //如果只是修改重复时间，则更新重复子表所有时间
        //如果修改了提醒时间，则更新提醒表所有时间
        if (oldc.st != c.st || oldc.tx != c.tx) {
          let sq = "update gtd_sp set st = '" + c.st + "' where si = '" + c.si + "'";
          await this.sqlExce.execSql(sq);

          //保存提醒表
          await this.saveOrUpdTx(c);
        }

      }
      await this.sqlExce.update(c);

      //restful用参数
      let agd = new AgdPro();
      this.setAdgPro(agd, c);

      await this.agdRest.save(agd);

      resolve(scd);
      return;
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

      //获取当前日程详情及相关内容
      let ret = new ScdData();
      ret = await this.get("", sr);

      //刷新联系人，联系人存在判断 不存在获取更新 ，刷新本地缓存
      let fs: FsData = new FsData();
      fs = this.userConfig.GetOneBTbl(newc.ui);
      if (fs) {
        ret.fs = fs;
      } else {
        //从服务器获取对象，放入本地库，刷新缓存
        ret.fs = await this.contactsServ.updateOneFs(newc.ui);
      }

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
    c.ji = agd.ap;
    //重复
    c.rt = agd.ar;

    //时间(YYYY/MM/DD)
    let adt = agd.adt.split(" ");
    c.sd = adt[0];

    if (adt.length == 1) {
      //全天
      c.st = "99:99";
      c.et = "99:99"
    } else {
      c.st = adt[1];
      c.et = adt[1];
    }

    //提醒
    c.tx = agd.aa;
    //备注
    c.bz = agd.am;
    //他人创建
    c.gs = "1";
    //新消息未读
    c.du = "0";
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
