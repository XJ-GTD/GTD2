import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {MsEntity} from "../../entity/ms.entity";



/**
 * message sqlite
 *
 * create by hjd on 2018/11/23
 */
@Injectable()
export class MsSqlite {
  constructor( private baseSqlite: BaseSqlite) { }

  /**
   * 添加Message消息
   * @param {MsEntity} ms
   * @returns {Promise<any>}
   */
  addMs(ms:MsEntity):Promise<any>{
    return this.baseSqlite.save(ms);
  }

  /**
   * 修改Message消息
   * @param {MsEntity} ms
   * @returns {Promise<any>}
   */
  updateMs(ms:MsEntity):Promise<any>{
    return this.baseSqlite.update(ms);
  }

  /**
   * 删除Message消息
   * @param {MsEntity} ms
   * @returns {Promise<any>}
   */
  deletMs(ms:MsEntity):Promise<any>{
    return this.baseSqlite.delete(ms);
  }

  /**
   * 查询Message消息
   * @returns {Promise<any>}
   */
  getMs(ms:MsEntity):Promise<any>{
    let sql="select mi,mn,md,mt from GTD_H where 1=1";
    if(ms.mi!=null){
      sql=sql+' mi="' + ms.mi +'",';
    }
    if(ms.mn!=null){
      sql=sql+' mn="' + ms.mn +'",';
    }
    if(ms.md!=null){
      sql=sql+' substr(md,1,10)="' + ms.md +'",';
    }
    if(ms.mt!=null){
      sql=sql+' mt="' + ms.mt +'",';
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   *根据ID查询
   * @param {ms:MsEntity}
   */
  getOne(ms:MsEntity):Promise<any>{
    return this.baseSqlite.getOne(ms);
  }

  /**
   * 查询当月Message消息
   * @returns {Promise<any>}
   */
  getMonthMs(month:string):Promise<any>{
    let sql="select mi,mn,substr(md,1,10) md,mt,rI from GTD_H where mf='0' and substr(md,1,7)='"+month +"'";
    return this.baseSqlite.executeSql(sql,[]);
  }

}


