import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {RguEntity} from "../../entity/rgu.entity";
import {RuEntity} from "../../entity/ru.entity";
import {BsModel} from "../../model/out/bs.model";
import {SyncModel} from "../../model/sync.model";
import {DataConfig} from "../../app/data.config";
import {SyncEntity} from "../../entity/sync.entity";

/**
 * 授权联系人
 */
@Injectable()
export class RelmemSqlite {

  constructor(private baseSqlite: BaseSqlite) {}

  /**
   * 添加授权联系人
   */
  aru(ru:RuEntity):Promise<BsModel>{
    return this.baseSqlite.save(ru);
  }

  /**
   * 更新授权联系人
   */
  uru(ru:RuEntity):Promise<any>{
    return this.baseSqlite.update(ru);
  }

  /**
   * 查询授权联系人
   * @param {string} id 主键
   * @param {string} ran 别名
   * @param {string} rN 名称
   * @param {string} rC 手机号
   * @param {string} rel  0联系人,1群组
   */
  getrus(id:string,ran:string,rN:string,rC:string,rel:string):Promise<any>{
    let sql="SELECT * FROM GTD_B where 1=1";
    if(id != null && id !=''){
      sql = sql + " and id='"+id+"'";
    }
    if(rel != null && rel !=''){
      sql = sql + " and rel='"+rel+"'";
    }
    if(ran != null && ran !=''){
      sql = sql + " and ran like '%"+ran+"%'";
    }
    if(rN != null && rN !=''){
      sql = sql + " and rN like '%"+rN+"%'";
    }
    if(rC != null && rC !=''){
      sql = sql + " and rC like '%"+rC+"%'";
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 删除授权联系人
   * @param {RuEntity} ru
   * @returns {Promise<any>}
   */
  dru(ru:RuEntity):Promise<any>{
    return this.baseSqlite.delete(ru);
  }

  /**
   * 根据ID查询
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  getOne(rgu:RguEntity):Promise<any>{
    return this.baseSqlite.getOne(rgu);
  }

  /**
   * 添加群组人员
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  addRgu(rgu:RguEntity):Promise<any>{
    return this.baseSqlite.save(rgu);
  }
  /**
   * 查询群组人员
   * @param @param {string} id 群组主键
   * @returns {Promise<any>}
   */
  getRgus(id:string):Promise<any>{
    let sql="SELECT gb.*,bs.id rugId,bs.bmi FROM GTD_B gb " +
      "left join GTD_B_X bs on bs.bmi = gb.id where bs.bi='" + id +"'";
    return this.baseSqlite.executeSql(sql,[]);
  }


  /**
   * 删除群组人员
   * @param {string} bi 群组主键ID
   * @param {string} bmi 关系人ID
   * @returns {Promise<any>}
   */
  delRgu(id:string,bmi:string):Promise<any>{
    let sql = "delete from GTD_B_X where 1=1";
    if(id != null && id != ''){
       sql=sql + " and id = '"+id+"'";
    }
    if(bmi != null && bmi != ''){
      sql=sql + " and bmi = '"+bmi+"'";
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 根据日程ID获取相关参与人
   * @param {string} sI
   * @returns {Promise<any>}
   */
  getRgusBySi(sI:string):Promise<any>{
    let sql = 'select gb.*,gd.uI,gd.sdt from GTD_D gd left join GTD_B gb on gd.rui = gb.id where gd.sI="'+sI+'"';
    return this.baseSqlite.executeSql(sql,[]);
  }

  xfGetRu(py:string):Promise<any>{
    let pyL = py.split(",");
    let sql = "select * from  GTD_B where ";
    let ranpy = '';
    let rNpy='';
    for(let i=0;i<pyL.length;i++){
      if(pyL[i] != ''){
        if(ranpy==''){
          ranpy="ranpy in ('"+pyL[i]+"'";
        }else{
          ranpy=ranpy + ",'"+pyL[i]+"'";
        }
        if(rNpy==''){
          rNpy="rNpy in ('"+pyL[i]+"'";
        }else{
          rNpy=rNpy + ",'"+pyL[i]+"'";
        }
      }
    }
    sql = sql + ranpy + ") or " + rNpy +")";
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 服务器登录同步联系人转sql
   * @param {Array<SyncModel>} syncs
   */
  syncToRuSql(syncs:Array<SyncModel>){
    let sql = '';
      if (syncs != null && syncs.length > 0) {
        for (let i = 0; i < syncs.length; i++) {
          let sync = syncs[i];
          let en = new RuEntity();
          en.id = sync.tableA;
          en.ran = sync.tableB;
          en.ranpy = sync.tableC;
          en.rI = sync.tableD;
          en.hiu = sync.tableE;
          en.rN = sync.tableF;
          en.rNpy = sync.tableG;
          en.rC = sync.tableH;
          en.rF = sync.tableI;
          en.rel = sync.tableJ;
          sync.tableK = DataConfig.uInfo.uI;
          en.ot = sync.tableL;
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
   * 服务器登录同步联系人群组表转sql
   * @param {Array<SyncModel>} syncs
   */
  syncToRguSql(syncs:Array<SyncModel>){
    let sql = '';
    if(syncs != null && syncs.length>0) {
      for (let i = 0; i < syncs.length; i++) {
        let sync = syncs[i];
        let en = new RguEntity();
        en.id = sync.tableA;
        en.bi = sync.tableB;
        en.bmi = sync.tableC;
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
   * 服务器定时同步联系人表
   * @param {JhEntity} en
   */
  syncRuTime(en:RuEntity,ac:string): Promise<any> {
    let sql = '';
    let sync = new SyncEntity();
    sync.tableA = en.id ;
    sync.tableB = en.ran;
    sync.tableC = en.ranpy;
    sync.tableD = en.rI;
    sync.tableE = en.hiu;
    sync.tableF = en.rN;
    sync.tableG = en.rNpy;
    sync.tableH = en.rC;
    sync.tableI = en.rF;
    sync.tableJ = en.rel;
    sync.tableK = DataConfig.uInfo.uI;
    sync.action =ac;
    sync.tableName = DataConfig.GTD_B
    return this.baseSqlite.save(sync);
  }

  /**
   * 服务器定时同步群组联系人表
   * @param {JhEntity} en
   */
  syncRguTime(en:Array<RguEntity>,tn:string): Promise<any> {
    let sql = '';
    for(let rgu of en){
      let sync = new SyncEntity();
      sync.tableA = rgu.id ;
      sync.tableB = rgu.bi;
      sync.tableC = rgu.bmi;
      sync.tableName = DataConfig.GTD_B_X;
      sync.action = tn;
      sql +=sync.isq;
    }
    return this.baseSqlite.importSqlToDb(sql);
  }

}
