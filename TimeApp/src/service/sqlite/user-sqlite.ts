import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {UEntity} from "../../entity/u.entity";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class UserSqlite {

  constructor( private baseSqlite: BaseSqlite) { }

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
       uCt: string, aQ: string, uT:string,uty:string):Promise<any>{
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
  userIsExist(ui:string):Promise<any>{
    return this.baseSqlite.executeSql('select * from GTD_A where uI=?',[ui])
  }

  getUo():Promise<any>{
      let sql='select * from GTD_A';
      return this.baseSqlite.executeSql(sql,[])
  }

//   this.sqlite.executeSql('replace into GTD_A(uI,uty) VALUES (?,?)',['6688','0']).then(data=>{
//   console.log(data);
//   this.sqlite.executeSql('select * from GTD_A',[])
// .then(data0=>{
//   console.log(data0)
//   this.sqlite.executeSql('replace into GTD_A(uI,uty) VALUES (?,?)',['6688','1'])
// .then(data1=>{
//   console.log(data1)
//   this.sqlite.executeSql('select * from GTD_A',[])
// .then(data2=>{
//   console.log(data2)
// })
// })
//
// })
// })
}
