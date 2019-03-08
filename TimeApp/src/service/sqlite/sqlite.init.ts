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

/**
 * create by on 2019/3/5
 */
@Injectable()
export class SqliteInit {



  constructor(private atbl:ATbl, private btbl:BTbl, private bxtbl:BxTbl,
              private ctbl:CTbl, private dtbl:DTbl, private ebtl:ETbl,
              private gtbl:GTbl, private jhtbl:JhTbl,private stbl :STbl,
              private sptbl:SpTbl,private utbl:UTbl,private ytbl :YTbl,
              private sqlexec : SqliteExec) {
  }

  /**
   * 创建/更新表
   * @param {string} updateSql 更新SQL
   * @returns {Promise<any>}
   */
  async createTables(){
    let count = 0;
    count ++ ;
    let a:ATbl = new ATbl();
    await this.sqlexec.drop(a);
    count ++ ;
    await this.sqlexec.create(a);

    count ++;
    await this.atbl.cT();

    return count;

  }
}
