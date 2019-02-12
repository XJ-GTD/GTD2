import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {RuModel} from "../../model/ru.model";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {UtilService} from "../util-service/util.service";
import {RcModel} from "../../model/rc.model";
import {BsModel} from "../../model/out/bs.model";
import {DataConfig} from "../../app/data.config";
import {ReturnConfig} from "../../app/return.config";
import {MsSqlite} from "./ms-sqlite";
import {SyncModel} from "../../model/sync.model";
import {RcbModel} from "../../model/rcb.model";
import {SyncEntity} from "../../entity/sync.entity";
import {ReadlocalService} from "../readlocal.service";
import * as moment from "moment";
import {RcoModel} from "../../model/out/rco.model";
import {SyncSqlite} from "./sync-sqlite";


/**
 * 日程子表处理
 *
 * create w on 2018/10/24
 */
@Injectable()
export class RcbSqlite{

  constructor( private baseSqlite: BaseSqlite,
            private msSqlite:MsSqlite,
            private sync:SyncSqlite,
            private util:UtilService) {

  }

  /**
   * 添加对应标签表数据
   * @param {string} sI 日程主键
   * @param {string} tk 标签类型
   * @param {string} cft 重复类型
   * @param {string} rm 备注
   * @param {string} ac 闹铃类型
   * @param {string} fh 是否完成0未完成，1完成
   * @returns {Promise<any>}
   */
  addLbData(rc:RcEntity,tk:string,cft:string,rm:string,ac:string,fh:string):Promise<RcbModel>{
    return new Promise((resolve, reject) => {
      let en = new RcbModel();
      en.id = this.util.getUuid();
      en.sI=rc.sI;
      en.tk=tk;
      en.cft=cft;
      en.rm=rm;
      if(ac && ac != null && ac != ''){
        en.ac=ac;
        let sdt = new Date(rc.sd).getTime() - Number(en.ac) * 60 * 1000;
        en.dt=moment(sdt).format('YYYY/MM/DD HH:mm')
      }

      en.fh=fh;
      if(en.tn != null && en.tn != ''){
        this.baseSqlite.executeSql(en.rpsq,[]).then(data=>{
          //添加本地日程到同步表
          console.log('------------- WorkSqlite addLbData 同步表--------------');
          this.syncRcbTime(en,en.tn,DataConfig.AC_O);
          resolve(en);
        }).catch(e=>{
          console.log('------------- WorkSqlite addLbData Error：' + JSON.stringify(e));
          en.code= ReturnConfig.ERR_CODE;
          en.message=ReturnConfig.ERR_MESSAGE;
          reject(e);
        })
      }else{
        resolve(en);
      }

    })
  }

  /**
   * 更新对应标签表数据
   * @param {string} sI 日程主键
   * @param {string} tk 标签类型
   * @param {string} cft 重复类型
   * @param {string} rm 备注
   * @param {string} ac 闹铃类型
   * @param {string} fh 是否完成0未完成，1完成
   * @returns {Promise<any>}
   */
  updateLbData(subId:string,rc:RcEntity,tk:string,cft:string,rm:string,ac:string,fh:string):Promise<any>{
    return new Promise((resolve, reject) => {
      if(tk != '' && tk !=null){
        let rcb = new RcbModel();
        rcb.sI = rc.sI;
        rcb.cft = cft;
        rcb.rm=rm;
        if(ac && ac != null && ac != ''){
          rcb.ac=ac;
          let sdt = new Date(rc.sd).getTime() - Number(rcb.ac) * 60 * 1000;
          rcb.dt=moment(sdt).format('YYYY/MM/DD HH:mm')
        }
        rcb.fh=fh;
        rcb.tk = tk;
        console.log('----worksqlite updateLbData 先删除原来标签子表----');
        let oldRcb:RcbModel = new RcbModel();
        this.getRcbSql(rc.sI).then(data=>{
          if(data && data.rows && data.rows.length>0){
            oldRcb.id = data.rows.item(0).id;
            oldRcb.sI =rc.sI;
            oldRcb.tk = data.rows.item(0).lI;
            if(oldRcb.tk != tk){
              return this.baseSqlite.delete(oldRcb);
            }else{
              rcb.id = oldRcb.id
            }
          }
        }).then(data=>{
          if(data){
            return this.syncRcbTime(oldRcb,oldRcb.tn,DataConfig.AC_D);
          }
        }).then(data=>{
          console.log('----worksqlite updateLbData 再保存新标签子表----');
          if(data){
            rcb.tk = tk;
            rcb.id = this.util.getUuid();
          }
          return this.baseSqlite.executeSql(rcb.rpsq,[]);
        }).then(data=>{
          return this.syncRcbTime(rcb,rcb.tn,DataConfig.AC_O);
        }).then(data=>{
          resolve(data);
        }).catch(e=>{
          console.log('----worksqlite updateLbData 保存新标签子表 ERROR：'+JSON.stringify(e));
          reject(e);
        })
      }else{
        let bs = new BsModel();
        resolve(bs);
      }
    })
  }

  /**
   * 更新对应标签表数据
   * @param {string} sI 日程主键
   * @param {string} tk 标签类型
   * @param {string} cft 重复类型
   * @param {string} rm 备注
   * @param {string} ac 闹铃类型
   * @param {string} fh 是否完成0未完成，1完成
   * @returns {Promise<any>}
   */
  updateLbDataMq(rc:RcEntity,rcb:RcbModel):Promise<any>{
    return new Promise((resolve, reject) => {
      if(rcb.tk != '' && rcb.tk !=null){
        console.log('----worksqlite updateLbData 先删除原来标签子表----');
        if(rcb.ac && rcb.ac != null && rcb.ac != ''){
          let str:string =rc.sd;
          let sdt:number = new Date(str).getTime() - parseInt(rcb.ac) * 60 * 1000;
          rcb.dt=moment(sdt).format('YYYY/MM/DD HH:mm')
        }
        let oldRcb:RcbModel = new RcbModel();
        this.getRcbSql(rc.sI).then(data=>{
          if(data && data.rows && data.rows.length>0){
            oldRcb.id = data.rows.item(0).id;
            oldRcb.sI =rc.sI;
            oldRcb.tk = data.rows.item(0).lI;
            if(rcb.tk != oldRcb.tk){
              return this.baseSqlite.delete(oldRcb);
            }
          }
        }).then(data=>{
          if(data){
            return this.syncRcbTime(oldRcb,oldRcb.tn,DataConfig.AC_D);
          }
        }).then(data=>{
          console.log('----worksqlite updateLbData 再保存新标签子表----');
          return this.baseSqlite.executeSql(rcb.rpsq,[]);
        }).then(data=>{
          return this.syncRcbTime(rcb,rcb.tn,DataConfig.AC_O);
        }).then(data=>{
          resolve(data);
        }).catch(e=>{
          console.log('----worksqlite updateLbData 保存新标签子表 ERROR：'+JSON.stringify(e));
          reject(e);
        })
      }else{
        let bs = new BsModel();
        resolve(bs);
      }
    })
  }

  /**
   * 根据日程ID获取标签子表数据
   * @returns {string}
   */
  getRcbSql(sI:string):Promise<any>{
    let sql= 'select gc.*,lbd.* from GTD_C gc ' +
      'inner join (select sI,cft,wd,ac,fh,tk,rm,dt,id from GTD_C_BO ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id  from GTD_C_C ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id  from GTD_C_RC ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id  from GTD_C_JN ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id  from GTD_C_MO) lbd on lbd.sI = gc.sI  where gc.sI="'+sI+'"' ;
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 添加对应标签表数据
   * @param {string} sI 日程主键
   * @param {RcbModel} en 子表对象
   * @returns {Promise<any>}
   */
  addLbSub(rc:RcEntity,en:RcbModel):Promise<RcbModel>{
    return new Promise((resolve, reject) => {
      en.sI=rc.sI;

      if(en.tn != null && en.tn != ''){
        if(en.ac && en.ac != null && en.ac != ''){
          let sdt = new Date(rc.sd).getTime() - Number(en.ac) * 60 * 1000;
          en.dt=moment(sdt).format('YYYY/MM/DD HH:mm');
        }
        this.baseSqlite.executeSql(en.rpsq,[]).then(data=>{
          //添加本地日程到同步表
          console.log('------------- WorkSqlite addLbData 同步表--------------');
          this.syncRcbTime(en,en.tn,DataConfig.AC_O);
          resolve(en);
        }).catch(e=>{
          console.log('------------- WorkSqlite addLbData Error：' + JSON.stringify(e));
          en.code= ReturnConfig.ERR_CODE;
          en.message=ReturnConfig.ERR_MESSAGE;
          reject(e);
        })
      }else{
        resolve(en);
      }

    })
  }

  /**
   * 服务器同步日程子表转sql
   * @param {Array<SyncModel>} syncs
   * @param {string} tn 子表名
   */
  syncToRcbSql(syncs:Array<SyncModel>,tn:string){
    let sql = '';
    if(syncs != null && syncs.length>0) {
      for (let i = 0; i < syncs.length; i++) {
        let sync = syncs[i];
        let en = new RcbModel();
        en.id = sync.tableA;
        en.sI = sync.tableB;
        en.rm = sync.tableC;
        en.cft = sync.tableD;
        en.ac = sync.tableE;
        en.dt = sync.tableF;
        en.fh = sync.tableG;
        en.wd = sync.tableH;
        en.tn = tn;
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
   * 服务器定时同步日程子表
   * @param {RcEntity} en
   * @param {string} ac 执行动作0添加，1更新，2删除
   */
  syncRcbTime(en:RcbModel,tn:string,ac:string): Promise<any> {
    let sql = '';
    let sync = new SyncEntity();
    sync.tableA = en.id ;
    sync.tableB = en.sI;
    sync.tableC = en.rm;
    sync.tableD = en.cft;
    sync.tableE = en.ac;
    if(en.dt != null && en.dt != ''){
      sync.tableF = moment(en.dt).format('YYYY-MM-DD HH:mm');
    }
    sync.tableG = en.fh;
    if(en.wd != null && en.wd != ''){
      sync.tableH = moment(en.wd).format('YYYY-MM-DD HH:mm');
    }

    sync.action= ac;
    sync.tableName = tn;
    return this.sync.save(sync.isq);
  }
}
