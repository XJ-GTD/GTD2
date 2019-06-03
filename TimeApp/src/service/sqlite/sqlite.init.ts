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
  }

  /**
   * 创建/更新表
   * @param {string} updateSql 更新SQL
   * @returns {Promise<any>}
   */
  async createTablespath(version:number) {
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
  }


  /**
   * 初始化表数据
   * @param {BsModel} data
   * @returns {Promise<any>}
   */
  initDataSub(): Promise<any> {
    return new Promise((resolve, reject) => {

      console.log("-------------------系统 ------------------");

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

      console.log("-------------------BaseSqlite initData table  data to start ------------------");

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

        //服务器 计划数据
        for (let bipl of data.bipl) {
          let jhtbl = new JhTbl();
          jhtbl.ji = bipl.planid;
          jhtbl.jn = bipl.planname;
          jhtbl.jg = bipl.plandesc;
          jhtbl.jc = bipl.planmark;
          jhtbl.jt = "1";
          urlList.push(jhtbl.inT());
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
        this.sqlexec.batExecSql(urlList).then(data => {
            resolve(data);

          }
        )
      }).catch(error=>{
        resolve(error);
      })

    })


  }
}
