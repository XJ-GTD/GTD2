import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {RguEntity} from "../../entity/rgu.entity";
import {JhEntity} from "../../entity/jh.entity";

/**
 * 授权联系人
 */
@Injectable()
export class JhSqlite {

  constructor(private baseSqlite: BaseSqlite) {}

  /**
   * 添加计划
   */
  ajh(jh:JhEntity){
    return this.baseSqlite.save(jh);
  }

  /**
   * 更新计划
   */
  ujh(jh:JhEntity){
    return this.baseSqlite.update(jh);
  }

  /**
   * 查询计划
   * @param {string} jn 计划名
   */
  getJhs(jn:string){
    let sql="SELECT * FROM GTD_J_H where 1=1";
    if(jn != null && jn !=''){
      sql = sql + " and jn='"+jn+"'";
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 删除计划
   * @param {JhEntity}
   * @returns {Promise<any>}
   */
  djh(jh:JhEntity){
    return this.baseSqlite.delete(jh);
  }

  /**
   * 根据ID查询计划
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  getOne(ji:string){
    let sql = "SELECT * FROM GTD_J_H where ji=?"
    return this.baseSqlite.executeSql(sql,[ji]);
  }

}
