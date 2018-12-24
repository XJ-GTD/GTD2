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

/**
 * 初始化
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class SyncService {

  constructor( private base:BaseSqlite,private sync:SyncRestful) {

  }

  /**
   * 初始化字典数据及标签表
   */
  initzdlb():Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      console.log("------SyncService initzdlb restful 初始化字典数据及标签表 --------")
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
                  sql=sql+ 'insert into GTD_F(lai,lan,lat) values("'+ label.id+'","'+ label.value+'","'+ label.type+'");';
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
        console.log("-------SyncService initzdlb restful 初始化字典数据及标签表 Error："+JSON.stringify(e))
        base.message = e.message
        base.code = 1
        reject(base)
      })
    })
  }
}
