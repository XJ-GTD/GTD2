import {Injectable} from "@angular/core";
import {UserSqlite} from "./sqlite/user-sqlite";
import {UEntity} from "../entity/u.entity";
import {UModel} from "../model/u.model";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {BsModel} from "../model/out/bs.model";
import {PnRestful} from "./restful/pn-restful";
import { HTTP } from '@ionic-native/http';
import {LbSqlite} from "./sqlite/lb-sqlite";
import {SyncRestful} from "./restful/sync-restful";
import {DataConfig} from "../app/data.config";
import {ZtdSqlite} from "./sqlite/ztd-sqlite";
import {ReturnConfig} from "../app/return.config";
import {ZtdModel} from "../model/ztd.model";
import {UtilService} from "./util-service/util.service";

/**
 * 初始化
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class SyncService {

  constructor( private base:BaseSqlite,
               private sync:SyncRestful,
               private util:UtilService,
               private ztd:ZtdSqlite) {

  }

  /**
   * 初始化字典数据及标签表
   */
  initzdlb():Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      console.log("------SyncService initzdlb restful 初始化字典数据及标签表 --------")
      if(DataConfig.isFirst != 0){
        this.sync.init()
          .then(data => {
            console.log("-------SyncService initzdlb restful 初始化字典数据及标签表接口返回结果："+JSON.stringify(data))
            base = data
            if(data.code == 0 && data.data.syncDataList.length>0){
              let sql=''
              for(let a=0;a<data.data.syncDataList.length;a++){
                let res = data.data.syncDataList[a];
                //字典类型表
                if(res.type=='dictionary' && res.dataList.length>0){
                  for(let i=0;i<res.dataList.length;i++){
                    let dict = res.dataList[i];
                    let str = 'key'
                    sql=sql+ 'insert into GTD_X(zt,zv) values("'+ dict.key+'","'+ dict.value+'");';
                  }
                }
                //字典数据表
                if(res.type=='dictionaryData' && res.dataList.length>0){
                  for(let j=0;j<res.dataList.length;j++){
                    let dictd = res.dataList[j];
                    sql=sql+ 'insert into GTD_Y(zt,zk,zkv,px) values("'+ dictd.type+'","'+ dictd.key+'","'+ dictd.value+'",'+ dictd.id+');';
                  }
                }

                //标签表
                if(res.type=='label' && res.dataList.length>0){
                  for(let l=0;l<res.dataList.length;l++){
                    let label = res.dataList[l];
                    sql=sql+ 'insert into GTD_F(lai,lan,lat,lau) values("'+ label.id+'","'+ label.value+'","'+ label.type+'","'+ label.key+'");';
                  }
                }
              }

              if(sql != null){
                console.log("------SyncService initzdlb insert into table  --------")
                return this.base.importSqlToDb(sql);
              }
            }
          }).then(data=>{
          if(base.code==0 && base.data != null){
            console.log("------SyncService initzdlb insert into table End : " + JSON.stringify(data));
          }
          resolve(base)
        }).catch(e=>{
          console.error("-------SyncService initzdlb restful 初始化字典数据及标签表 Error："+JSON.stringify(e))
          base.message = e.message
          base.code = 1
          reject(base)
        })
      }else{
        console.log("------SyncService initzdlb restful 已初始化字典数据及标签表 --------")
        // this.initLocalData().then(data=>{
        //   if(ReturnConfig.RETURN_MSG.size==0){
        //     this.initzdlb()
        //   }
        // })
        resolve(base)
      }

    })
  }

  /**
   * 初始化本地静态数据
   * @returns {Promise<BsModel>}
   */
  initLocalData():Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      console.log("-------SyncService initLocalData sqlite 初始本地返回本地message------------");
      let ztL:any = null;
      this.ztd.getZtdMessage('400').then(data=>{
        console.log("-------SyncService initLocalData sqlite 初始本地静态数据本地message结果："+JSON.stringify(data));
        if(data && data.rows&&data.rows.length>0){
          let res = data.rows;
          for(let i=0;i<res.length;i++){
            ReturnConfig.RETURN_MSG.set(res.item(i).zk,res.item(i).zkv);
          }
          console.log("-------SyncService initLocalData ReturnConfig.RETURN_MSG 数据结果："+JSON.stringify(ReturnConfig.RETURN_MSG));
        }
        console.log("-------SyncService initLocalData sqlite 初始本地字典表数据 -------- ");
        return this.ztd.getZt('')
      }).then(data=>{
        console.log("-------SyncService initLocalData sqlite 初始本地字典表："+JSON.stringify(data));
        if(data && data.rows&&data.rows.length>0){
          ztL = data.rows;
          console.log("-------SyncService initLocalData ReturnConfig.RETURN_MSG 数据结果："+JSON.stringify(ReturnConfig.RETURN_MSG));
        }
        return this.ztd.getZtd('')
      }).then(data=>{
        console.log("-------SyncService initLocalData sqlite 初始本地字典表："+JSON.stringify(data));
        if(ztL !=null && data && data.rows&&data.rows.length>0){
          let res = data.rows;
          let ztMap = new Map<string,any>();
          for(let j=0;j<ztL.length;j++){
            let ztdL = new Array<ZtdModel>()
            for(let i=0;i<res.length;i++){
              if(ztL.item(j).zt == res.item(i).zt){
                ztdL.push(res.item(i));
              }
            }
            ztMap.set(ztL.item(j).zt,ztdL);
          }
          DataConfig.ZTD_MAP = ztMap;
          console.log("-------SyncService initLocalDataDataConfig.ZTD_MAP 数据结果："+JSON.stringify( DataConfig.ZTD_MAP));
        }
        resolve(base);
      }).catch(e=>{
        console.error("-------SyncService initLocalData sqlite 初始本地静态数据 Error："+JSON.stringify(e));
        base.message=e.message;
        base.code=1;
        reject(base)
      })
    })
  }

  /**
   * 登录同步数据
   */
  loginSync():Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      this.sync.loginSync(DataConfig.uInfo.uI,this.util.getDeviceId())
        .then(data=>{
          if(data && data.code==0){


          }
        })
    })

  }
}
