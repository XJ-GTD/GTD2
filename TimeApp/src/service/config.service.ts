import { Injectable } from '@angular/core';
import { BaseSqlite } from "./sqlite/base-sqlite";
import { UtilService } from "./util-service/util.service";
import { UserService } from "./user.service";
import { DataConfig } from "../app/data.config";
import {AppConfig} from "../app/app.config";
import {FiSqlite} from "./sqlite/fi-sqlite";

/**
 * 整体配置Service
 */
@Injectable()
// @Component({
//   providers: []
// })
export class ConfigService {
  constructor(private util : UtilService,
              private user:UserService,
              private fi : FiSqlite,
              private baseSqlite : BaseSqlite) {
  }

  initDataBase():Promise<boolean>{
   return new Promise((resolve, reject)=>{
     //先创建或链接数据库
     this.baseSqlite.createOrUpdateTable('').then(data=>{
          //初始化生成数据
          return this.baseSqlite.initData()
      }).then(data=> {
       //初始化静态变量数据
        this.user.getUo().then(ud=>{
          if(ud){
            let u:any= ud;
            DataConfig.uInfo=u;
            if(u.uT){
              AppConfig.HEADER_OPTIONS_JSON.headers.Authorization = u.uT;
            }
            console.log("ConfigService init userInfo :" + JSON.stringify(DataConfig.uInfo));
            resolve(true)
          }else{
            resolve(false)
          }
        })
     }).catch(e=>{
       console.error("config initDataBase error : " + e.message);
        resolve(false)
      });

      return;
    });

  }

  connectSqlLite():Promise<any>{
    var p = new Promise(function(resolve, reject){

    });
    return p;
  }
  //判断初始化进入页面
  isIntoBoot():Promise<boolean>{
    return  new Promise((resolve, reject)=>{
      //先判断是否手机还是网页
      this.util.isMobile()
      console.log("--------- 是否是手机模式打开 ： " + this.util.isMobile())
      //先创建或连接数据
      this.baseSqlite.createDb().then(data=>{
        console.log("config.service isIntoBoot createDb:: "+　JSON.stringify(data))
        if(data.code != 0){
          resolve(true)
        }
        console.log("--------- 判断是否是首次打开 start --------- ")
        return this.fi.isFi()
      }).then(data=>{
        console.log("config.service isIntoBoot Fi:: "+　JSON.stringify(data))
        //在判断版本表是否存在
        if(data.code>0){
          resolve(true)
        }else{
          resolve(false)
        }
      }).catch(e=>{
        console.log("config.service isIntoBoot error: "+　e.message)
        resolve(true)
      })
    });
  }

  /**
   * 更新版本表
   * @param {number} firstIn 版本号
   * @param {number} isup 是否更新0暂无更新，1已更新；1状态进入引导页，并更新成0
   * @returns {Promise<any>}
   */
  ufi(firstIn:number,isup:number):Promise<any>{
    return  new Promise((resolve, reject)=>{
      console.log('------ 更新版本表状态:'+isup+' --------');
      this.fi.ufi(firstIn,isup).then(data=>{
        resolve(data);
      }).catch(e=>{
        console.log('------ 更新版本表状态:'+isup+' Error:' +JSON.stringify(e));
        reject(e);
      })
    })
  }

}
