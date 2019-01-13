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
import {WorkSqlite} from "./sqlite/work-sqlite";
import {RelmemSqlite} from "./sqlite/relmem-sqlite";
import {JhSqlite} from "./sqlite/jh-sqlite";
import {SyvEntity} from "../entity/syv.entity";
import {SyncSqlite} from "./sqlite/sync-sqlite";

/**
 * 初始化
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class SyncService {

  constructor( private base:BaseSqlite,
               private syncR:SyncRestful,
               private syncS:SyncSqlite,
               private util:UtilService,
               private work:WorkSqlite,
               private relmem:RelmemSqlite,
               private jh:JhSqlite,
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
        this.syncR.init()
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
          resolve(base);
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
      this.ztd.getZtdMessage(DataConfig.MESSAGE_TYPE).then(data=>{
        console.log("-------SyncService initLocalData sqlite 初始本地静态数据本地message结果："+JSON.stringify(data));
        if(data && data.rows&&data.rows.length>0){
          let res = data.rows;
          for(let i=0;i<res.length;i++){
            ReturnConfig.RETURN_MSG.set(res.item(i).zk,res.item(i).zkv);
          }
          console.log("-------SyncService initLocalData ReturnConfig.RETURN_MSG 数据结果："+JSON.stringify(ReturnConfig.RETURN_MSG));
        }
        console.log("-------SyncService initLocalData sqlite 初始本地字典表数据 -------- ");
        return this.ztd.getZtd(DataConfig.TEXT_TYPE)
      }).then(data=>{
        console.log("-------SyncService initLocalData sqlite 初始本地静态数据本地message结果："+JSON.stringify(data));
        if(data && data.rows&&data.rows.length>0){
          let res = data.rows;
          for(let i=0;i<res.length;i++){
            DataConfig.TEXT_CONTENT.set(res.item(i).zk,res.item(i).zkv);
          }
          console.log("-------SyncService initLocalData ReturnConfig.RETURN_MSG 数据结果："+JSON.stringify(DataConfig.TEXT_CONTENT));
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
        this.loginSync();
        this.syncTime();
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
      let sql='';
      let base = new BsModel();
      this.syncR.loginSync(DataConfig.uInfo.uI,this.util.getDeviceId())
        .then(data=> {
          if (data && data.code == 0 && data.data.userDataList.length > 0) {
            let uds = data.data.userDataList;
            sql = this.getsql(sql,uds);
          }
          if (sql != '') {
            console.log('----- 登录同步服务器数据导入本地库 ------');
            return this.base.importSqlToDb(sql);
          }
        }).then(data=>{
        console.log('----- 登录同步服务器数据结束 ------' + JSON.stringify(data));
        resolve(base);
      }).catch(e=>{
        console.error('----- 登录同步服务器数据失败 ------' + JSON.stringify(e));
        base.code=ReturnConfig.ERR_CODE;
        base.message=ReturnConfig.ERR_MESSAGE;
        resolve(base);
      })
    })

  }

  /**
   * 定时更新接口
   * @param {string} uI
   * @param {string} dI
   * @param {string} vs
   * @param sdl
   * @returns {Promise<BsModel>}
   */
  syncTime():Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let sql = '';
      let bs = new BsModel();
      let sv = new SyvEntity();
      sv.si=1;
      let sdl:any;
      let bv:number=0;
      let fv='0';
      this.base.getOne(sv).then(data=>{
        if(data&&data.rows&&data.rows.length>0){
          bv=data.rows.item(0).bv;
          fv=data.rows.item(0).fv;
        }
        return this.syncS.getsyL(bv);
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
        return this.syncR.syncTime(DataConfig.uInfo.uI,this.util.getUuid(),fv,sdl)
      }).then(data=>{
        if (data && data.code == 0 && data.data.userDataList.length > 0) {
          fv = data.data.version;
          let uds = data.data.userDataList;
          sql = this.getsql(sql,uds);
        }
        if (sql != '') {
          console.log('----- 定时同步服务器数据导入本地库 ------');
          return this.base.importSqlToDb(sql);
        }
      }).then(data=>{
        sv.bv = bv;
        sv.fv = fv;
        return this.base.update(sv);
      })
        .then(data=>{
        resolve(bs);
      }).catch(e=>{
        bs.code = ReturnConfig.ERR_CODE;
        bs.message = ReturnConfig.ERR_MESSAGE;
        reject(bs);
      })

    })
  }

  /**
   * 拼接SQL
   * @param {string} sql
   * @param uds
   */
  getsql(sql:string,uds:any){
    for (let i = 0; i < uds.length; i++) {
      let ud = uds[i];
      //alert(ud.tableName.substr(0,5));
      if (ud.tableName == DataConfig.GTD_B) {
        sql+=this.relmem.syncToRuSql(ud.dataList);
      }else if(ud.tableName == DataConfig.GTD_B_X) {
        sql+=this.relmem.syncToRguSql(ud.dataList);
      }if (ud.tableName == DataConfig.GTD_C) {
        sql+=this.work.syncToRcSql(ud.dataList);
      }else if(ud.tableName == DataConfig.GTD_D) {
        sql+=this.work.syncToRcpSql(ud.dataList);
      }else if(ud.tableName.substr(0,5)==DataConfig.GTD_C){
        sql+=this.work.syncToRcbSql(ud.dataList,ud.tableName);
      }else if(ud.tableName==DataConfig.GTD_J_H){
        sql+=this.jh.syncToJhSql(ud.dataList);
      }
    }
    return sql;
  }
}
