import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {ReEntity} from "../../entity/re.entity";

/**
 * 闹铃
 */
@Injectable()
export class RemindSqlite {

  constructor(private baseSqlite: BaseSqlite) { }

  /**
   * 添加
   * @param {ReEntity} re
   * @returns {Promise<any>}
   */
  addRe(re:ReEntity):Promise<any>{
    return this.baseSqlite.save(re);
  }

  /**
   * 删除
   * @param {ReEntity} re
   * @returns {Promise<any>}
   */
  delRe(re:ReEntity):Promise<any>{
    return this.baseSqlite.delete(re);
  }

  /**
   * 修改
   * @param {ReEntity} re
   * @returns {Promise<any>}
   */
  updateRe(re:ReEntity):Promise<any>{
    return this.baseSqlite.update(re);
  }

  /**
   * 查询
   * @param {ReEntity} re
   * @returns {Promise<any>}
   */
  getRe(re:ReEntity):Promise<any>{
    let sql="SELECT ri,sI,rd FROM GTD_E where 1=1";
    if(re.ri!=null){
      sql=sql+' ri="' + re.ri +'",';
    }
    if(re.sI!=null){
      sql=sql+' sI="' + re.sI +'",';
    }
    if(re.rd!=null){
      sql=sql+' rd="' + re.rd +'",';
    }

    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 根据ID查询
   * @param {ReEntity} re
   * @returns {Promise<any>}
   */
  getOne(re:ReEntity):Promise<any>{
    return this.baseSqlite.getOne(re);
  }
}
