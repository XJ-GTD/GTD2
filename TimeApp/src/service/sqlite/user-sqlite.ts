import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {UEntity} from "../../entity/u.entity";
import {SyncEntity} from "../../entity/sync.entity";
import {DataConfig} from "../../app/data.config";
import {SyncModel} from "../../model/sync.model";
import {SyncSqlite} from "./sync-sqlite";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class UserSqlite {

  constructor( private baseSqlite: BaseSqlite,private sync: SyncSqlite) { }

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
    if(uN == null || uN==''){
      u.uN = "user" + uI.substr(0,10)
    }
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

  update(u:UEntity):Promise<any>{
    return this.baseSqlite.update(u);
  }
  /**
   * 服务器同步用户表转sql
   * @param {Array<SyncModel>} syncs
   * @param {string} tn 子表名
   */
  syncToUSql(syncs:Array<SyncModel>){
    let sql = '';
    if(syncs != null && syncs.length>0) {
      for (let i = 0; i < syncs.length; i++) {
        let sync = syncs[i];
        let en = new UEntity();
        en.uI = sync.tableA;
        en.uN = sync.tableB;
        en.hIU = sync.tableC;
        en.biy = sync.tableD;
        en.rn = sync.tableE;
        en.iC = sync.tableF;
        en.uS = sync.tableG;
        en.uty = sync.tableH;
        if (sync.action == '2') {
          sql += en.dsq;
        } else {
          sql += en.usq;
        }
      }
    }
    return sql;
  }
  /**
   * 服务器定时同步用户表
   * @param {RcEntity} en
   * @param {string} ac 执行动作0添加，1更新，2删除
   */
  syncUTime(en:UEntity,ac:string): Promise<any> {
    let sql = '';
    let sync = new SyncEntity();
    sync.tableA = en.uI ;
    sync.tableB = en.uN;
    sync.tableC = en.hIU;
    sync.tableD = en.biy;
    sync.tableE = en.rn;
    sync.tableF = en.iC;
    sync.tableG = en.uS;
    sync.tableH = en.uCt;
    sync.tableI = en.uty;
    sync.action= ac;
    sync.tableName = DataConfig.GTD_A;
    return this.sync.save(sync.isq);
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
