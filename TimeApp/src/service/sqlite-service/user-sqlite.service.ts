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

  constructor( private baseSqlite: BaseSqliteService) { }

  /**
   * 添加用户
   * @param {string} _uI 用户uuID
   * @param {string} _uN 昵称
   * @param {string} _hIU 头像URL
   * @param {string} _biy 生日
   * @param {string} _uS 性别
   * @param {string} _uCt 联系方式
   * @param {string} _aQ 消息队列
   * @param {string} _uT token
   * @param _uty 0游客1正式用户
   */
  addu(uI: string, oUI:string,uN: string,hIU: string,biy: string,uS: string,
       uCt: string, aQ: string, uT:string,uty:string){
    let u = new UEntity();
    u.uI=uI;
    u.oUI=oUI;
    u.uN=uN;
    u.hIU=hIU;
    u.biy=biy;
    u.uS=uS;
    u.uCt=uCt;
    u.aQ=aQ;
    u.uT=uT;
    u.uty=uty;
    return this.baseSqlite.save(u);
  }
  /**
   * 根据账号UUID判断用户是否存在
   * @param param
   * @returns {Promise<any>}
   */
  userIsExist(sql,outParam:boolean){
    return new Promise((resolve, reject) =>
    {
      this.baseSqlite.executeSql('select * from GTD_A'+sql,[]).then(data=>{
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
    return  this.baseSqlite.executeSql(sql,[])
  }
  getUo(){
      let sql='select * from GTD_A';
      return this.baseSqlite.executeSql(sql,[])
  }

}
