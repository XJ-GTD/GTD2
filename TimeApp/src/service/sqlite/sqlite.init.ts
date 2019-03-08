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
    let count = 0;
    count++;
    let a: ATbl = new ATbl();
    await this.sqlexec.drop(a);
    count++;
    await this.sqlexec.create(a);
    count++;

    let b: BTbl = new BTbl();
    await this.sqlexec.drop(b);
    count++;
    await this.sqlexec.create(b);
    count++;

    let bx: BxTbl = new BxTbl();
    await this.sqlexec.drop(bx);
    count++;
    await this.sqlexec.create(bx);
    count++;

    let c: CTbl = new CTbl();
    await this.sqlexec.drop(c);
    count++;
    await this.sqlexec.create(c);
    count++;

    let d: DTbl = new DTbl();
    await this.sqlexec.drop(d);
    count++;
    await this.sqlexec.create(d);
    count++;

    let e: ETbl = new ETbl();
    await this.sqlexec.drop(e);
    count++;
    await this.sqlexec.create(e);
    count++;

    let g: GTbl = new GTbl();
    await this.sqlexec.drop(g);
    count++;
    await this.sqlexec.create(g);
    count++;

    let jh: JhTbl = new JhTbl();
    await this.sqlexec.drop(jh);
    count++;
    await this.sqlexec.create(jh);
    count++;

    let s: STbl = new STbl();
    await this.sqlexec.drop(s);
    count++;
    await this.sqlexec.create(s);
    count++;

    let sp: SpTbl = new SpTbl();
    await this.sqlexec.drop(sp);
    count++;
    await this.sqlexec.create(sp);
    count++;

    let u: UTbl = new UTbl();
    await this.sqlexec.drop(u);
    count++;
    await this.sqlexec.create(u);
    count++;

    let y: YTbl = new YTbl();
    await this.sqlexec.drop(y);
    count++;
    await this.sqlexec.create(y);
    count++;
    return count;

  }

  /**
   * 初始化表数据
   * @param {BsModel} data
   * @returns {Promise<any>}
   */
  initData(): Promise<any> {
    return new Promise((resolve, reject) => {

      console.log("-------------------BaseSqlite initData table  data to start ------------------");

      this.syncRestful.initData().then(data => {
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

        //web端
        return this.sqlexec.batExecSql(urlList);
      })

    })


  }
}
