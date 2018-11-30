import { Injectable } from '@angular/core';
import {BaseSqliteService} from "./base-sqlite.service";
import {RguEntity} from "../../entity/rgu.entity";

/**
 * 授权联系人
 */
@Injectable()
export class RelmemSqliteService {

  constructor(private baseSqlite: BaseSqliteService) { }

  /**
   * 添加
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  addRgu(rgu:RguEntity){
    return this.baseSqlite.save(rgu);
  }

  /**
   * 删除
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  delRgu(rgu:RguEntity){
    return this.baseSqlite.delete(rgu);
  }

  /**
   * 修改
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  updateRgu(rgu:RguEntity){
    return this.baseSqlite.update(rgu);
  }

  /**
   * 查询
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  getRgu(rgu:RguEntity){
    let sql="SELECT bi,bmi FROM GTD_B_X where 1=1";
    if(rgu.bi!=null){
      sql=sql+' bi="' + rgu.bi +'",';
    }
    if(rgu.bmi!=null){
      sql=sql+' bmi="' + rgu.bmi +'",';
    }

    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 根据ID查询
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  getOne(rgu:RguEntity){
    return this.baseSqlite.getOne(rgu);
  }
}
