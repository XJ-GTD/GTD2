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
  select(u:UEntity,outParam:UoModel): Promise<any>{
    return new Promise((resolve, reject) =>{
      // if(u.uI != null){
      let sql='select * from GTD_A where 1=1';

      if(u.uI != null){
        sql=sql+'and uI="'+u.uI+'"';
      }
      this.baseSqliteService.executeSql(sql,[])
        .then(data=>{
          resolve(data);
          // if(data&& data.rows && data.rows.length>0){
          //   outParam.ct=data.rows.length;
          //   let d=new Array<UEntity>()
          //   for(let i=0;i<data.rows.length;i++){
          //     d[i]=data.rows.item(i);
          //   }
          //   outParam.us=d;
          //   resolve(outParam);
          // }else{
          //   outParam.ct=0;
          //   resolve(outParam);
          // }
        }).catch(e=>{
        reject(e);
      })
      // }else{
      //   reject('入参不能为空！')
      // }
    })
  }

  selectOne(u:UEntity){
    return new Promise((resolve, reject) =>{
      // if(u.uI != null){
      let sql='select * from GTD_A where 1=1';

      if(u.uI != null){
        sql=sql+'and uI="'+u.uI+'"';
      }
      this.baseSqliteService.executeSql(sql,[])
        .then(data=>{
          let uu = new UEntity();
          if(data&& data.rows && data.rows.length>0){
            uu=data.rows.item(0);
            resolve(uu);
          }else{
            resolve(uu);
          }
        }).catch(e=>{
        reject(e);
      })
      // }else{
      //   reject('入参不能为空！')
      // }
    })
  }
}
