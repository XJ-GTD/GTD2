import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {FiEntity} from "../../entity/fi.entity";

/**
 * 字典数据表
 */
@Injectable()
export class ZtdSqlite {

  constructor(private baseSqlite: BaseSqlite) {}

  /**
   * 查询字典表
   * @param {string} id 主键
   */
  getZtdMessage(zt:string): Promise<any> {
    let sql="SELECT * FROM GTD_Y where 1=1";
    if(zt != null && zt!=''){
      sql = sql + " and zt='"+zt +"'";
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 查询字典类型表
   * @param {string} zt
   * @returns {Promise<any>}
   */
  getZt(zt:string): Promise<any> {
    let sql="SELECT * FROM GTD_X where zt !='400'";
    if(zt != null && zt!=''){
      sql = sql + " and zt='"+zt +"'";
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  getZtd(zt:string): Promise<any> {
    let sql="SELECT * FROM GTD_Y where zt !='400'";
    if(zt != null && zt!=''){
      sql = sql + " and zt='"+zt +"'";
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

}
