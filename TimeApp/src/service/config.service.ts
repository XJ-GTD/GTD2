import {Component, Injectable} from '@angular/core';
import {componentFactoryName} from "@angular/compiler";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {UtilService} from "./util-service/util.service";
import {UserService} from "./user.service";
import {AppConfig} from "../app/app.config";

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
      this.baseSqlite.isFi().then(data=>{
        console.log("config initDataBase info : " + JSON.stringify(data))
        if(data.code==1){
          console.log("config initDataBase 开始建表 ")
          //创建表
          return this.baseSqlite.createTable(data)
        }else if(data.code==3){
          //更新表
          console.log("config initDataBase 更新表 ")
          return this.baseSqlite.updateTable(data)
        }
      }).then(data=>{
        //初始化表数据
        if(data && data.data && data.data.code && data.data.code==1){
          console.log("config initDataBase 初始化表数据 ")
            return this.baseSqlite.init()
        }
      }).then(data=> {
       //初始化数据
        this.user.getUo().then(ud=>{
          if(ud && ud.u){
            AppConfig.uInfo=ud.u;
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

      })
    });
  }
}
