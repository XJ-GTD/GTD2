import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {RuModel} from "../../model/ru.model";
import {UtilService} from "../util-service/util.service";
import {RcdEntity} from "../../entity/rcd.entity";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class CalsSqlite{

  constructor( private baseSqlite: BaseSqlite,
            private util:UtilService) {

  }

  /**
   * 记录取消或删除的单日日程
   * @param {RcdEntity} rcd
   * @param {Array<RuModel>} rcps
   */
  save(rcd:RcdEntity):Promise<any>{
    return new Promise((resolve, reject) => {
      //记录
      this.baseSqlite.save(rcd).then(data=>{
        //添加本地日程到同步表
        console.log('------------- WorkSqlite save 同步表--------------')
        //this.syncRcdTime(rcd,DataConfig.AC_O);
        resolve(data);
      }).catch(e=>{
        console.log('------------- WorkSqlite save Error：' + JSON.stringify(e));
        reject(e);
      })
    })
  }


  /**
   * 查询日程中取消或删除的日程
   * @param {string} sI 日程ID
   */
  getRcd(rcd:RcdEntity):Promise<any>{
    let sql = 'select * from GTD_C_D where 1=1 '
    if(rcd.sI!=null && rcd.sI!=''){
      sql=sql+' and sI="' + rcd.sI +'"';
    }
    if(rcd.sd!=null && rcd.sd!=''){
      sql=sql+' and sd="' + rcd.sd +'"';
    }
    if(rcd.dI!=null && rcd.dI!=''){
      sql=sql+' and dI="' + rcd.dI +'"';
    }

    if(rcd.dI!=null && rcd.dI!=''){
      sql=sql+' and substr(ifnull(sd,""),1,7)="' + rcd.yM +'"';
    }
    return this.baseSqlite.executeSql(sql,[])
  }

  /**
   * 恢复取消或删除的日程关联表
   * @param {RcdEntity} rcd
   */
  dRcd(rcd:RcdEntity):Promise<any>{

    return new Promise((resolve, reject) => {
      //记录
      this.baseSqlite.delete(rcd).then(data=>{
        //添加本地日程到同步表
        console.log('------------- WorkSqlite save 同步表--------------')
        //this.syncRcdTime(rcd,DataConfig.AC_O);
        resolve(data);
      }).catch(e=>{
        console.log('------------- WorkSqlite save Error：' + JSON.stringify(e));
        reject(e);
      })
    })
  }
}
