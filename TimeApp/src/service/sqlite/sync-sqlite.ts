import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {FiEntity} from "../../entity/fi.entity";

/**
 * 字典数据表
 */
@Injectable()
export class SyncSqlite {

  constructor(private baseSqlite: BaseSqlite) {}

  /**
   * 获取最大同步表ID
   * @returns {Promise<any>}
   */
  getMaxId(): Promise<any> {
    let sql="SELECT max(id) FROM GTD_S_Y";
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 获取本地同步表数据
   * @param {string} id
   * @returns {Promise<any>}
   */
  getsyL(id:number): Promise<any> {
    let sql="SELECT * FROM GTD_S_Y where id >=" +id;
    return this.baseSqlite.executeSql(sql,[]);
  }

}
