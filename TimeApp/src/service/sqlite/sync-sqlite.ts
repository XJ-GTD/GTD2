import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {FiEntity} from "../../entity/fi.entity";
import {DataConfig} from "../../app/data.config";
import {SyncEntity} from "../../entity/sync.entity";
import {SyncService} from "../sync.service";
import {ReturnConfig} from "../../app/return.config";
import {UtilService} from "../util-service/util.service";
import {SyncRestful} from "../restful/sync-restful";
import {BsModel} from "../../model/out/bs.model";
import {SyvEntity} from "../../entity/syv.entity";

/**
 * 字典数据表
 */
@Injectable()
export class SyncSqlite {

  constructor(private baseSqlite: BaseSqlite,
    private util:UtilService,
              private syncR:SyncRestful
  ) {}

  /**
   * 获取最大同步表ID
   * @returns {Promise<any>}
   */
  getMaxId(): Promise<any> {
    let sql="SELECT max(id) FROM GTD_S_Y";
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 获取本地同步表数据
   * @param {string} id
   * @returns {Promise<any>}
   */
  getsyL(id:number): Promise<any> {
    let sql="SELECT * FROM GTD_S_Y where id >" +id +" order by id desc";
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 游客登录更新同步表用户ID
   */
  syncUpuISql():string{
    //参与人
    let sql='update GTD_S_Y set tableF="' +DataConfig.uInfo.uI +'" where tableName ="'+  DataConfig.GTD_D+'";';
    //日程
    sql=sql+'update GTD_S_Y set tableD="' +DataConfig.uInfo.uI +'" where tableName ="'+  DataConfig.GTD_C+'";';
    //联系人
    sql=sql+'update GTD_S_Y set tableK="' +DataConfig.uInfo.uI +'" where tableName ="'+  DataConfig.GTD_B+'";';
    //计划
    sql=sql+'update GTD_S_Y set tableD="' +DataConfig.uInfo.uI +'" where tableName ="'+  DataConfig.GTD_J_H+'";';
    return sql
  }

  /**
   *
   * @param {SyncEntity} sync
   * @returns {Promise<any>}
   */
  save(sql:string): Promise<any> {
    return new Promise((resolve, reject) =>{
      if(sql != ''){
        return this.baseSqlite.importSqlToDb(sql).then(data=>{
          //   return this.syncUplaod();
          // }).then(data=>{
          //   console.log("====== 添加同步表数据结束："+ JSON.stringify(data));
          //   console.log("====== 实时上传结束 ========");
          resolve(data);
        }).catch(e=>{
          console.error("====== 添加同步表报错 Error："+JSON.stringify(e));
          reject(e);
        })
      }else{
        resolve('sync-sqlite同步SQL TableA为空！');
      }

    })
  }

  /**
   * 实时上传数据
   * @param {string} uI
   * @param {string} dI
   * @param {string} vs
   * @param sdl
   * @returns {Promise<BsModel>}
   */
  syncUplaod():Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let sql = '';
      let bs = new BsModel();
      let sv = new SyvEntity();
      sv.si=1;
      let sdl:any;
      let bv:number=0;
      let fv='0';
      console.log("============= 实时调用上传接口 strat ============");
      this.baseSqlite.getOne(sv).then(data=>{
        if(data&&data.rows&&data.rows.length>0){
          bv=data.rows.item(0).bv;
          fv=data.rows.item(0).fv;
        }
        if(fv==''){
          fv='0';
        }
        console.log("============= 实时调用上传接口 查询版本结果：" + JSON.stringify(data));
        return this.getsyL(bv);
      }).then(data=>{
        bs = data;
        let sdl = [];
        if(data && data.rows && data.rows.length>0){
          bv = data.rows.item(0).id;
          for(let tn of DataConfig.TABLE_NAMES){
            let sd:any = {};
            sd.tableName = tn;
            sd.dataList=[];
            for(let i=0;i<data.rows.length;i++){
              let tb=data.rows.item(i);
              if(tb.tableName == tn){
                sd.dataList.push(tb);
              }
            }
            sdl.push(sd);
          }
        }
        console.log("============= 实时调用上传接口发送Result请求参数：" + JSON.stringify(sdl));
        return this.syncR.syncUpload(DataConfig.uInfo.uI,this.util.getDeviceId(),fv,sdl)
      }).then(data=>{
        sv.bv = bv;
        sv.fv = fv;
        console.log("============= 实时调用上传接口发送Result请求结束 END：" + JSON.stringify(data));
        return this.baseSqlite.update(sv);
      }).then(data=>{
        console.log("============= 实时调用上传更新版本 END：" + JSON.stringify(data));
        resolve(bs);
      }).catch(e=>{
        console.error("============= 实时调用上传错误 ERROR：" + JSON.stringify(e));
        bs.code = ReturnConfig.ERR_CODE;
        bs.message = ReturnConfig.ERR_MESSAGE;
        reject(bs);
      })
    })
  }

}
