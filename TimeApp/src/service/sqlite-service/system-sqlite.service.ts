import { Injectable } from '@angular/core';
import {BaseSqliteService} from "./base-sqlite.service";
import {StEntity} from "../../entity/st.entity";

/**
 * 系统设置
 */
@Injectable()
export class SystemSqliteService {

  constructor(private baseSqlite: BaseSqliteService) { }

  /**
   * 添加
   * @param {StEntity} st
   */
  addSt(st:StEntity){
    return this.baseSqlite.save(st);
  }

  /**
   * 删除
   * @param {StEntity} st
   */
  delSt(st:StEntity){
    return this.baseSqlite.delete(st);
  }

  /**
   * 修改
   * @param {StEntity} st
   */
  updateSt(st:StEntity){
   return this.baseSqlite.update(st);
  }

  /**
   * 查询系统设置 （参数为空则查所有）
   * @param {StEntity} st
   * @returns {Promise<any>}
   */
  getSt(st:StEntity){
    let sql="SELECT si,sn,ss,st FROM GTD_G WHERE 1=1";
    if(st.si!=null){
      sql=sql+' si="' + st.si +'",';
    }
    if(st.sn!=null){
      sql=sql+' sn="' + st.sn +'",';
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 根据ID查询
   * @param {StEntity} st
   * @returns {Promise<any>}
   */
  getOne(st:StEntity){
    return this.baseSqlite.getOne(st);
  }
}
