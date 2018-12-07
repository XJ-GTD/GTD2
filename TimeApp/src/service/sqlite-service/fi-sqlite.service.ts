import { Injectable } from '@angular/core';
import {BaseSqliteService} from "./base-sqlite.service";
import {FiEntity} from "../../entity/fi.entity";

/**
 * 版本表
 */
@Injectable()
export class FiSqliteService {

  constructor(private baseSqlite: BaseSqliteService) {}

  /**
   * 添加版本表
   */
  afi(firstIn:number,isup:number){
    let fi = new FiEntity();
    fi.id=1;
    fi.firstIn=firstIn;
    fi.isup=isup;
    return this.baseSqlite.save(fi);
  }

  /**
   * 更新版本表
   * @param {number} firstIn 版本号
   * @param {number} isup 是否更新0暂无更新，1已更新；1状态进入引导页，并更新成0
   * @returns {Promise<any>}
   */
  ufi(firstIn:number,isup:number){
    let fi = new FiEntity();
    fi.id=1;
    fi.firstIn=firstIn;
    fi.isup=isup;
    return this.baseSqlite.update(fi);
  }

  /**
   * 查询版本表
   * @param {string} id 主键
   */
  getfi(id:number){
    let sql="SELECT * FROM GTD_FI where 1=1";
    if(id != null){
      sql = sql + " and id="+id;
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 删除版本表
   * @param {FiEntity}
   * @returns {Promise<any>}
   */
  djh(jh:FiEntity){
    return this.baseSqlite.delete(jh);
  }


}
