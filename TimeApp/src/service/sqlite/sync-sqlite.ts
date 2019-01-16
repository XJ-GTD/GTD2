import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {FiEntity} from "../../entity/fi.entity";
import {DataConfig} from "../../app/data.config";

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
    let sql="SELECT * FROM GTD_S_Y where id >" +id +" order by id desc";
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 游客登录更新同步表用户ID
   */
  syncUpuISql():string{
    //参与人
    let sql='update GTD_S_Y set tableF="' +DataConfig.uInfo.uI +'" where tableName ="'+  DataConfig.GTD_D+'";';
    //日程
    sql=sql+'update GTD_S_Y set tableD="' +DataConfig.uInfo.uI +'" where tableName ="'+  DataConfig.GTD_C+'";';
    //联系人
    sql=sql+'update GTD_S_Y set tableD="' +DataConfig.uInfo.uI +'" where tableName ="'+  DataConfig.GTD_B+'";';
    //计划
    sql=sql+'update GTD_S_Y set tableD="' +DataConfig.uInfo.uI +'" where tableName ="'+  DataConfig.GTD_J_H+'";';
    return sql
  }

}
