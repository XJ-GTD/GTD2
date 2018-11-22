import { Injectable } from '@angular/core';
import {Platform, Events, List} from 'ionic-angular';
import {BaseSqliteService} from "./base-sqlite.service";
import {UEntity} from "../../entity/u.entity";
import {UoModel} from "../../model/out/uo.model";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class UserSqliteService {

  constructor( private baseSqliteService: BaseSqliteService) { }

  /**
   * 根据账号UUID判断用户是否存在
   * @param param
   * @returns {Promise<any>}
   */
  userIsExist(sql,outParam:boolean){
    return new Promise((resolve, reject) =>
    {
      this.baseSqliteService.executeSql('select * from GTD_A'+sql,[]).then(data=>{
          if(data && data.rows && data.rows.length>0){
              resolve(outParam);
          }else{
              resolve(!outParam);
          }
      }).catch(e=>{
          reject(e);
      })
    })
  }

  selectAll(u:UEntity,outParam:UoModel){
    let sql='select * from GTD_A where 1=1';
    if(u.uI != null){
      sql=sql+'and uI="'+u.uI+'"';
    }
    return  this.baseSqliteService.executeSql(sql,[])
  }
  getUo(u:UEntity): Promise<UoModel>{
    return new Promise((resolve, reject) =>{
      let sql='select * from GTD_A';
      let op = new UoModel();
      this.baseSqliteService.executeSql(sql,[])
        .then(data=>{
          if(data&& data.rows && data.rows.length>0){
            op.u=data.rows.item(0);
            op.code=0;
            op.message="成功"
            resolve(op);
          }else{
            op.code=2;
            op.message="暂无用户信息"
            resolve(op);
          }
        }).catch(e=>{
          op.code=1;
          op.message="系统错误"
          resolve(op);
      })
    })
  }

}
