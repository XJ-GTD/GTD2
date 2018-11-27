import { Injectable } from '@angular/core';
import {BaseSqliteService} from "./base-sqlite.service";
import {ReEntity} from "../../entity/re.entity";

/**
 * 闹铃
 */
@Injectable()
export class RemindSqliteService {

  constructor(private baseSqlite: BaseSqliteService) {}

  /**
   * 添加
   * @param {ReEntity} re
   * @returns {Promise<any>}
   */
  addRe(re:ReEntity){
    return this.baseSqlite.save(re);
  }

  /**
   * 删除
   * @param {ReEntity} re
   * @returns {Promise<any>}
   */
  delRe(re:ReEntity){
    return this.baseSqlite.delete(re);
  }

  /**
   * 修改
   * @param {ReEntity} re
   * @returns {Promise<any>}
   */
  updateRe(re:ReEntity){
    return this.baseSqlite.update(re);
  }

  /**
   * 查询
   * @param {ReEntity} re
   * @returns {Promise<any>}
   */
  getRe(re:ReEntity){
    let sql="SELECT ri,pi,rd FROM GTD_E where 1=1";
    if(re.ri!=null){
      sql=sql+' ri="' + re.ri +'",';
    }
    if(re.pi!=null){
      sql=sql+' pi="' + re.pi +'",';
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
  getOne(re:ReEntity){
    return this.baseSqlite.getOne(re);
  }
}
