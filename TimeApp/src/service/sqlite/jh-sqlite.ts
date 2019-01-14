import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {RguEntity} from "../../entity/rgu.entity";
import {JhEntity} from "../../entity/jh.entity";
import {SyncModel} from "../../model/sync.model";
import {DataConfig} from "../../app/data.config";
import {SyncEntity} from "../../entity/sync.entity";

/**
 * 授权联系人
 */
@Injectable()
export class JhSqlite {

  constructor(private baseSqlite: BaseSqlite) {}

  /**
   * 添加计划
   */
  ajh(jh:JhEntity): Promise<any> {
    return this.baseSqlite.save(jh);
  }

  /**
   * 更新计划
   */
  ujh(jh:JhEntity): Promise<any> {
    return this.baseSqlite.update(jh);
  }

  /**
   * 查询计划
   * @param {string} jn 计划名
   */
  getJhs(jn:string): Promise<any> {
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
  djh(jh:JhEntity): Promise<any> {
    return this.baseSqlite.delete(jh);
  }

  /**
   * 根据ID查询计划
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  getOne(ji:string): Promise<any> {
    let sql = "SELECT * FROM GTD_J_H where ji=?"
    return this.baseSqlite.executeSql(sql,[ji]);
  }
  /**
   * 服务器登录同步计划表转sql
   * @param {Array<SyncModel>} syncs
   */
  syncToJhSql(syncs:Array<SyncModel>){
    let sql = '';
    if(syncs != null && syncs.length>0) {
      for (let i = 0; i < syncs.length; i++) {
        let sync = syncs[i];
        let en = new JhEntity();
        en.ji = sync.tableA;
        en.jn = sync.tableB;
        en.jg = sync.tableC;
        sync.tableD = DataConfig.uInfo.uI;
        if (sync.action == '2') {
          sql += en.dsq;
        } else {
          sql += en.rpsq;
        }
      }
    }
    return sql;
  }

  /**
   * 服务器定时同步计划表
   * @param {JhEntity} en
   */
  syncJhTime(en:JhEntity,ac:string): Promise<any> {
    let sql = '';
      let sync = new SyncEntity();
      sync.tableA = en.ji;
      sync.tableB = en.jn ;
      sync.tableC = en.jg;
      sync.tableD = DataConfig.uInfo.uI;
      sync.action = ac;
      sync.tableName = DataConfig.GTD_J_H;
    return this.baseSqlite.save(sync);
  }


}
