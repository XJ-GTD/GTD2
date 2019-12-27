import {Injectable} from '@angular/core';
import {SpTbl} from "./tbl/sp.tbl";
import {ATbl} from "./tbl/a.tbl";
import {BTbl} from "./tbl/b.tbl";
import {BxTbl} from "./tbl/bx.tbl";
import {CTbl} from "./tbl/c.tbl";
import {DTbl} from "./tbl/d.tbl";
import {ETbl} from "./tbl/e.tbl";
import {GTbl} from "./tbl/g.tbl";
import {JhTbl} from "./tbl/jh.tbl";
import {STbl} from "./tbl/s.tbl";
import {UTbl} from "./tbl/u.tbl";
import {YTbl} from "./tbl/y.tbl";
import {SqliteExec} from "../util-service/sqlite.exec";
import {UtilService} from "../util-service/util.service";
import {SyncRestful} from "../restful/syncsev";
import {StTbl} from "./tbl/st.tbl";
import {BhTbl} from "./tbl/bh.tbl";
import {JtTbl} from "./tbl/jt.tbl";
import {LogTbl} from "./tbl/log.tbl";
import {SuTbl} from "./tbl/su.tbl";
import {MkTbl} from "./tbl/mk.tbl";
import {MoTbl} from "./tbl/mo.tbl";
import {JhaTbl} from "./tbl/jha.tbl";
import {MomTbl} from "./tbl/mom.tbl";
import {JtaTbl} from "./tbl/jta.tbl";
import {EvTbl} from "./tbl/ev.tbl";
import {CaTbl} from "./tbl/ca.tbl";
import {TTbl} from "./tbl/t.tbl";
import {WaTbl} from "./tbl/wa.tbl";
import {FjTbl} from "./tbl/fj.tbl";
import {MrkTbl} from "./tbl/mrk.tbl";
import {ParTbl} from "./tbl/par.tbl";
import {DelType, SyncType} from "../../data.enum";
import {AtTbl} from "./tbl/at.tbl";
import {RwTbl} from "./tbl/rw.tbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class SqliteInit {


  constructor(private sqlexec: SqliteExec, private util: UtilService, private syncRestful: SyncRestful) {
  }

  /**
   * 创建/更新表
   * @param {string} updateSql 更新SQL
   * @returns {Promise<any>}
   */
  async createTables() {
    let a: ATbl = new ATbl();
    await this.sqlexec.drop(a);
    await this.sqlexec.create(a);

    let b: BTbl = new BTbl();
    await this.sqlexec.drop(b);
    await this.sqlexec.create(b);

    let bx: BxTbl = new BxTbl();
    await this.sqlexec.drop(bx);
    await this.sqlexec.create(bx);

    let c: CTbl = new CTbl();
    await this.sqlexec.drop(c);
    await this.sqlexec.create(c);

    let d: DTbl = new DTbl();
    await this.sqlexec.drop(d);
    await this.sqlexec.create(d);

    let e: ETbl = new ETbl();
    await this.sqlexec.drop(e);
    await this.sqlexec.create(e);

    let g: GTbl = new GTbl();
    await this.sqlexec.drop(g);
    await this.sqlexec.create(g);

    let jh: JhTbl = new JhTbl();
    await this.sqlexec.drop(jh);
    await this.sqlexec.create(jh);

    let s: STbl = new STbl();
    await this.sqlexec.drop(s);
    await this.sqlexec.create(s);

    let sp: SpTbl = new SpTbl();
    await this.sqlexec.drop(sp);
    await this.sqlexec.create(sp);

    let u: UTbl = new UTbl();
    await this.sqlexec.drop(u);
    await this.sqlexec.create(u);

    let y: YTbl = new YTbl();
    await this.sqlexec.drop(y);
    await this.sqlexec.create(y);

    let st: StTbl = new StTbl();
    await this.sqlexec.drop(st);
    await this.sqlexec.create(st);

    let bh: BhTbl = new BhTbl();
    await this.sqlexec.drop(bh);
    await this.sqlexec.create(bh);

    let jt: JtTbl = new JtTbl();
    await this.sqlexec.drop(jt);
    await this.sqlexec.create(jt);

    let su: SuTbl = new SuTbl();
    await this.sqlexec.drop(su);
    await this.sqlexec.create(su);

    let mk: MkTbl = new MkTbl();
    await this.sqlexec.drop(mk);
    await this.sqlexec.create(mk);

    let mo: MoTbl = new MoTbl();
    await this.sqlexec.drop(mo);
    await this.sqlexec.create(mo);

    // 增加第三期数据库表
    let mom: MomTbl = new MomTbl();
    await this.sqlexec.dropByParam(mom);
    await this.sqlexec.createByParam(mom);

    let jha: JhaTbl = new JhaTbl();
    await this.sqlexec.dropByParam(jha);
    await this.sqlexec.createByParam(jha);

    let jta: JtaTbl = new JtaTbl();
    await this.sqlexec.dropByParam(jta);
    await this.sqlexec.createByParam(jta);

    let ev: EvTbl = new EvTbl();
    await this.sqlexec.dropByParam(ev);
    await this.sqlexec.createByParam(ev);

    let ca: CaTbl = new CaTbl();
    await this.sqlexec.dropByParam(ca);
    await this.sqlexec.createByParam(ca);

    let t: TTbl = new TTbl();
    await this.sqlexec.dropByParam(t);
    await this.sqlexec.createByParam(t);

    let wa: WaTbl = new WaTbl();
    await this.sqlexec.dropByParam(wa);
    await this.sqlexec.createByParam(wa);

    let fj: FjTbl = new FjTbl();
    await this.sqlexec.dropByParam(fj);
    await this.sqlexec.createByParam(fj);


    let mrk: MrkTbl = new MrkTbl();
    await this.sqlexec.dropByParam(mrk);
    await this.sqlexec.createByParam(mrk);

    let par: ParTbl = new ParTbl();
    await this.sqlexec.dropByParam(par);
    await this.sqlexec.createByParam(par);

    let rw: RwTbl = new RwTbl();
    await this.sqlexec.dropByParam(rw);
    await this.sqlexec.createByParam(rw);

  }

  /**
   * 创建/更新表
   * @param {string} updateSql 更新SQL
   * @returns {Promise<any>}
   */
  async createTablespath(version: number, from: number) {
    if (version  == 1 ){
      let log: LogTbl = new LogTbl();
      await this.sqlexec.drop(log);
      await this.sqlexec.create(log);
    }else if (version == 2){
      let su: SuTbl = new SuTbl();
      await this.sqlexec.drop(su);
      await this.sqlexec.create(su);
    } else if (version == 3) {
      // 2019/05/10
      // 席理加
      // 设置客户端设备ID,版本更新时不同机型会产生不同的设备ID,需要缓存保证一致
      let deviceUUIDTbl: YTbl = new YTbl();
      deviceUUIDTbl.yi = this.util.getUuid();
      deviceUUIDTbl.yt = "DI";
      deviceUUIDTbl.yk = "DI";
      deviceUUIDTbl.yv = this.util.deviceId();
      await this.sqlexec.save(deviceUUIDTbl);
    } else if (version == 4) {
      // 2019/05/28
      // 席理加
      // 增加日程语义标签标注表
      let mk: MkTbl = new MkTbl();
      await this.sqlexec.drop(mk);
      await this.sqlexec.create(mk);
    } else if (version == 5) {
      // 2019/06/03
      // 席理加
      // 增加智能提醒 - 每日简报 参数
      if (from > 0 && from < 5) {
        let dailyReportTbl: YTbl = new YTbl();
        dailyReportTbl.yi = this.util.getUuid();
        dailyReportTbl.yt = "DR";
        dailyReportTbl.yk = "DR";
        dailyReportTbl.ytn = "每日简报";
        dailyReportTbl.yn = "每日简报";
        dailyReportTbl.yv = "1";
        await this.sqlexec.save(dailyReportTbl);

        // 每日简报 - 提醒时间
        let dailyReportParamTbl: YTbl = new YTbl();
        dailyReportParamTbl.yi = this.util.getUuid();
        dailyReportParamTbl.yt = "DRP1";
        dailyReportParamTbl.yk = "DRP1";
        dailyReportParamTbl.ytn = "每日简报";
        dailyReportParamTbl.yn = "每日简报 通知时间";
        dailyReportParamTbl.yv = "08:30";
        await this.sqlexec.save(dailyReportParamTbl);
      }

      // 2019/06/06
      // 席理加
      // 增加备忘表
      let mo: MoTbl = new MoTbl();
      await this.sqlexec.drop(mo);
      await this.sqlexec.create(mo);
    } else if (version == 6) {
      // JtTbl 增加附件相关3个字段
      if (from > 0 && from < 6) {
        let altercols: Array<string> = new Array<string>();

        altercols.push(`alter table gtd_jt add column fjt varchar(20);`);
        altercols.push(`alter table gtd_jt add column fjn varchar(20);`);
        altercols.push(`alter table gtd_jt add column fj varchar(50);`);

        await this.sqlexec.batExecSql(altercols);

        // 日历 - 缺省日历
        let defaultJhParamTbl: YTbl = new YTbl();
        defaultJhParamTbl.yi = this.util.getUuid();
        defaultJhParamTbl.yt = "DJH";
        defaultJhParamTbl.yk = "DJH";
        defaultJhParamTbl.ytn = "缺省日历";
        defaultJhParamTbl.yn = "日程创建 缺省日历 个人";
        defaultJhParamTbl.yv = "personalcalendar";
        await this.sqlexec.save(defaultJhParamTbl);
      }

      // 增加默认的计划 个人和工作
      let defaultjhs: Array<string> = new Array<string>();

      let jh: JhTbl = new JhTbl();
      jh.ji = 'personalcalendar';
      jh.jn = '个人';
      jh.jg = '个人';
      jh.jc = '#735e46';
      jh.jt = '2';
      defaultjhs.push(jh.inT());

      jh = new JhTbl();
      jh.ji = 'workcalendar';
      jh.jn = '工作';
      jh.jg = '工作';
      jh.jc = '#876a29';
      jh.jt = '2';
      defaultjhs.push(jh.inT());

      await this.sqlexec.batExecSql(defaultjhs);
    }else if(version == 7){
      //新增AT表
      let at: AtTbl = new AtTbl();
      await this.sqlexec.dropByParam(at);
      await this.sqlexec.createByParam(at);
    }else if(version == 8) {
      if (from > 0 && from < 8 ) {
        //群组表加新删除状态字段
        let sqlparam = new Array<any>();
        let sq = ` ALTER TABLE gtd_g ADD COLUMN del varchar(6) DEFAULT 'undel' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_b_x ADD COLUMN del varchar(6) DEFAULT 'undel' ;`;
        sqlparam.push([sq, []]);
        await this.sqlexec.batExecSqlByParam(sqlparam);
      }
    }else if(version == 9) {
      if (from > 0 && from < 9 ){
        //事件表加关联，事件变更类型字段
        let sqlparam = new Array<any>();
        let sq = ` ALTER TABLE gtd_ev ADD COLUMN updstate varchar(10) DEFAULT 'self' ;`;
        sqlparam.push([sq ,[]]);
        sq = ` ALTER TABLE gtd_ev ADD COLUMN evrelate varchar(50) DEFAULT '' ;`;
        sqlparam.push([sq ,[]]);
        await this.sqlexec.batExecSqlByParam(sqlparam);
      }


    }else if (version == 10){
      //新增rw表
      if (from > 0 && from < 10 ) {
        let rw: RwTbl = new RwTbl();
        await this.sqlexec.dropByParam(rw);
        await this.sqlexec.createByParam(rw);
      }
    }else if (version == 11){
      //新增checksum字段
      if (from > 0 && from < 11 ) {
        let sqlparam = new Array<any>();
        let sq = ` ALTER TABLE gtd_ev ADD COLUMN checksum varchar(50) DEFAULT '' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_fj ADD COLUMN checksum varchar(50) DEFAULT '' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_mom ADD COLUMN checksum varchar(50) DEFAULT '' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_jta ADD COLUMN checksum varchar(50) DEFAULT '' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_par ADD COLUMN checksum varchar(50) DEFAULT '' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_at ADD COLUMN checksum varchar(50) DEFAULT '' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_jha ADD COLUMN checksum varchar(50) DEFAULT '' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_wa ADD COLUMN checksum varchar(50) DEFAULT '' ;`;
        sqlparam.push([sq, []]);
        await this.sqlexec.batExecSqlByParam(sqlparam);
      }
    }else if (version ==12){

    }else if (version ==13){
      //添加提醒设置
      if (from > 0 && from < 13 ) {
        let closevoice: YTbl = new YTbl();
        closevoice.yi = this.util.getUuid();
        closevoice.yt = "CLV";
        closevoice.yk = "CLV";
        closevoice.ytn = "关闭消息";
        closevoice.yn = "关闭消息";
        closevoice.yv = "0";
        await this.sqlexec.save(closevoice);

        let simplevoice: YTbl = new YTbl();
        simplevoice.yi = this.util.getUuid();
        simplevoice.yt = "SIV";
        simplevoice.yk = "SIV";
        simplevoice.ytn = "简单播报";
        simplevoice.yn = "简单播报";
        simplevoice.yv = "0";
        await this.sqlexec.save(simplevoice);

        let combinevoice: YTbl = new YTbl();
        combinevoice.yi = this.util.getUuid();
        combinevoice.yt = "CBV";
        combinevoice.yk = "CBV";
        combinevoice.ytn = "合并播报";
        combinevoice.yn = "合并播报";
        combinevoice.yv = "0";
        await this.sqlexec.save(combinevoice);
      }
    }else if (version ==14){
      //添加AI语音设置
      if (from > 0 && from < 14 ) {
        let autolisten: YTbl = new YTbl();
        autolisten.yi = this.util.getUuid();
        autolisten.yt = "ALIS";
        autolisten.yk = "ALIS";
        autolisten.ytn = "自动开启听筒";
        autolisten.yn = "自动开启听筒";
        autolisten.yv = "1";
        await this.sqlexec.save(autolisten);

        let simpleprompt: YTbl = new YTbl();
        simpleprompt.yi = this.util.getUuid();
        simpleprompt.yt = "SIP";
        simpleprompt.yk = "SIP";
        simpleprompt.ytn = "向导简要提示";
        simpleprompt.yn = "向导简要提示";
        simpleprompt.yv = "0";
        await this.sqlexec.save(simpleprompt);

        let jf: YTbl = new YTbl();
        jf.yi = this.util.getUuid();
        jf.yt = "JF";
        jf.yk = "JF";
        jf.ytn = "交互方式";
        jf.yn = "交互方式";
        jf.yv = "2";
        await this.sqlexec.save(jf);
      }
    }else if (version ==15){
      //添加他人提醒语音字段
      if (from > 0 && from < 15 ) {
        let sqlparam = new Array<any>();
        let sq = ` ALTER TABLE gtd_u ADD COLUMN rob varchar(4) DEFAULT '9' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_b ADD COLUMN rob varchar(4) DEFAULT '9' ;`;
        sqlparam.push([sq, []]);
        sq = ` ALTER TABLE gtd_b ADD COLUMN utt integer DEFAULT 0 ;`;
        sqlparam.push([sq, []]);
        await this.sqlexec.batExecSqlByParam(sqlparam);
      }
    }
  }

  /**
   * 初始化表数据
   * @param {BsModel} data
   * @returns {Promise<any>}
   */
  initDataSub(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.syncRestful.initData().then(async data => {
        let s: STbl = new STbl();
        await this.sqlexec.drop(s);
        await this.sqlexec.create(s);
        //服务器URL数据
        let urlList: Array<string> = [];
        for (let apil of data.apil) {
          let stbl = new STbl();
          stbl.si = this.util.getUuid();
          stbl.st = "URL";
          stbl.stn = "URL";
          stbl.sn = apil.desc;
          stbl.yk = apil.name;
          stbl.yv = apil.value;
          urlList.push(stbl.inT());
        }


        let su: SuTbl = new SuTbl();
        await this.sqlexec.drop(su);
        await this.sqlexec.create(su);
        //服务器 语音数据
        for (let vrs of data.vrs) {
          //v2版本
          if (vrs.needAnswer) {
            let sutbl = new SuTbl();
            sutbl.sui = this.util.getUuid();
            sutbl.subt = vrs.name;
            sutbl.sust = vrs.type;
            sutbl.sus = vrs.needAnswer;
            sutbl.suc = vrs.value;
            sutbl.sum = vrs.desc;
            sutbl.subtsn = "";
            sutbl.sustsn = "";
            sutbl.sut = vrs.tips?vrs.tips:"";
            urlList.push(sutbl.inT());
          }
        }

        //web端
        this.sqlexec.batExecSql(urlList).then(data => {
            resolve(data);

          }
        )
      }).catch(err => {

        resolve(err);
      })

    })


  }

  /**
   * 初始化表数据
   * @param {BsModel} data
   * @returns {Promise<any>}
   */
  initData(): Promise<any> {
    return new Promise((resolve, reject) => {

        this.syncRestful.initData().then(async data => {
        let s: STbl = new STbl();
        await this.sqlexec.drop(s);
        await this.sqlexec.create(s);
        //服务器URL数据
        let urlList: Array<any> = new Array<any>();
        for (let apil of data.apil) {
          let stbl = new STbl();
          stbl.si = this.util.getUuid();
          stbl.st = "URL";
          stbl.stn = "URL";
          stbl.sn = apil.desc;
          stbl.yk = apil.name;
          stbl.yv = apil.value;
          urlList.push(stbl.inT());
        }

        //服务器 计划数据
        for (let bipl of data.bipl) {
          let jhatbl = new JhaTbl();
          jhatbl.ji = bipl.planid;
          jhatbl.jn = bipl.planname;
          jhatbl.jg = bipl.plandesc;
          jhatbl.jc = bipl.planmark;
          jhatbl.jt = "1";
          jhatbl.tb = SyncType.synch;
          jhatbl.del = DelType.undel;
          jhatbl.jtd = "0";
          urlList.push(jhatbl.inTParam());
        }

        //服务器 用户偏好数据
        for (let dpfu of data.dpfu) {
          let ytbl = new YTbl();
          ytbl.yi = this.util.getUuid();
          ;
          ytbl.yt = dpfu.name;
          ytbl.ytn = dpfu.desc;
          ytbl.yn = dpfu.desc;
          ytbl.yk = dpfu.name;
          ytbl.yv = dpfu.value;
          urlList.push(ytbl.inT());
        }


        let su: SuTbl = new SuTbl();
        await this.sqlexec.drop(su);
        await this.sqlexec.create(su);
        //服务器 语音数据
        for (let vrs of data.vrs) {
          //v2版本
          if (vrs.needAnswer){
            let sutbl = new SuTbl();
            sutbl.sui = this.util.getUuid();
            sutbl.subt = vrs.name;
            sutbl.sust = vrs.type;
            sutbl.sus = vrs.needAnswer;
            sutbl.suc = vrs.value;
            sutbl.sum = vrs.desc;
            sutbl.subtsn = "";
            sutbl.sustsn = "";
            sutbl.sut = vrs.tips?vrs.tips:"";
            urlList.push(sutbl.inT());
          }
        }
        //web端
        this.sqlexec.batExecSqlByParam(urlList).then(data => {
            resolve(data);

          }
        )
      }).catch(error=>{
        resolve(error);
      })

    })


  }
}
