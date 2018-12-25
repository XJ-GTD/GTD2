import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {FiEntity} from "../../entity/fi.entity";

/**
 * 版本表
 */
@Injectable()
export class ZtdSqlite {

  constructor(private baseSqlite: BaseSqlite) {}

  /**
   * 查询版本表
   * @param {string} id 主键
   */
  getZtd(zt:string): Promise<any> {
    let sql="SELECT * FROM GTD_Y where 1=1";
    if(zt != null && zt!=''){
      sql = sql + " and zt='"+zt +"'";
    }
    return this.baseSqlite.executeSql(sql,[]);
  }
}
