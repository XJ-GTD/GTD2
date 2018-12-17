import { Injectable } from '@angular/core';
import { BaseSqlite } from "./sqlite/base-sqlite";
import { UtilService } from "./util-service/util.service";
import { UserService } from "./user.service";
import { DataConfig } from "../app/data.config";

/**
 * 整体配置Service
 */
@Injectable()
// @Component({
//   providers: []
// })
export class ConfigService {
  constructor(public util : UtilService,
              private user:UserService,
              public baseSqlite : BaseSqlite) {
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
            console.log("ConfigService init userInfo :" + JSON.stringify(DataConfig.uInfo))
            resolve(true)
          }else{
            resolve(false)
          }
        })
     }).catch(e=>{
       console.error("config initDataBase error : " + e.message)
        resolve(false)
      })

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

      //先创建或连接数据
      this.baseSqlite.createDb().then(data=>{
        console.log("config.service isIntoBoot createDb:: "+　JSON.stringify(data))
        if(data.code != 0){
          resolve(true)
        }
        return this.baseSqlite.isFi()
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
}
