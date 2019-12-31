import {IPatch} from "./ipatch";
import {SqliteExec} from "../service/util-service/sqlite.exec";

/**
 * create by on 2019/3/5
 */
export class Patch15 implements IPatch {

  constructor(private sqlexec : SqliteExec){

  }
  //补丁版本
  version:number = 15;

  //补丁内容
  async createPatch() {

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
