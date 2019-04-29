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

/**
 * create by on 2019/3/5
 */
@Injectable()
export class SqliteInit {


  constructor(private sqlexec: SqliteExec, private util: UtilService, private syncRestful: SyncRestful) {
    console.log("ha ha hah ha aha ha ")
  }
  ngOnInit(){
    console.log("ha ha hah ha aha ha ")

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

  }

  /**
   * 创建/更新表
   * @param {string} updateSql 更新SQL
   * @returns {Promise<any>}
   */
  async createTablespath(version:number) {
    if (version == 0 ){
      let log: LogTbl = new LogTbl();
      await this.sqlexec.drop(log);
      await this.sqlexec.create(log);
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

        //服务器 语音数据
        for (let vrs of data.vrs) {
          let stbl = new STbl();
          stbl.si = this.util.getUuid();
          stbl.st = "SPEECH";
          stbl.stn = "语音";
          stbl.sn = vrs.desc;
          stbl.yk = vrs.name;
          stbl.yv = vrs.value;
          urlList.push(stbl.inT());
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

        //服务器 语音数据
        for (let vrs of data.vrs) {
          let stbl = new STbl();
          stbl.si = this.util.getUuid();
          stbl.st = "SPEECH";
          stbl.stn = "语音";
          stbl.sn = vrs.desc;
          stbl.yk = vrs.name;
          stbl.yv = vrs.value;
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
