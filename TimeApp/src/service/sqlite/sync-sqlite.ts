import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {FiEntity} from "../../entity/fi.entity";

/**
 * 字典数据表
 */
@Injectable()
export class SyncSqlite {

  constructor(private baseSqlite: BaseSqlite) {}

  getMaxId(): Promise<any> {
    let sql="SELECT max(id) FROM GTD_S_Y";
    return this.baseSqlite.executeSql(sql,[]);
  }

}
