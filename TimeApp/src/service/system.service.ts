import { Injectable } from '@angular/core';
import {RemindSqliteService} from "./sqlite-service/remind-sqlite.service";
import {SystemSqliteService} from "./sqlite-service/system-sqlite.service";


/**
 * 系统设置
 */
@Injectable()
export class SystemService {

  constructor(private systemSqlite: SystemSqliteService) {

  }

  /**
   * 查询系统设置 （参数为空则查所有）
   * @param {string} si 主键
   * @param {string} sn 名称
   */
  getStl(si:string,sn:string){

  }
}
