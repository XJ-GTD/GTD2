import {Component, Injectable} from '@angular/core';
import {componentFactoryName} from "@angular/compiler";
import {BaseSqlite} from "./sqlite/base-sqlite";

/**
 * 整体配置Service
 */
@Injectable()
@Component({
  providers: []
})
export class ConfigService {
  constructor(private baseSqlite : BaseSqlite) {

  }

  initDataBase():Promise<any>{
    var p = new Promise(function(resolve, reject){

      //连接数据
      resolve(true);

    }).then(data=>{
      //检查有没有数据表
      return;

    }).then(data=>{
      //没有表创建表结构

      return;

      //存在数据表


    }).then(data=>{
      //初始化数据

      return;
    });
    return p;
  }

  connectSqlLite():Promise<any>{
    var p = new Promise(function(resolve, reject){

    });
    return p;
  }
  //判断初始化进入页面
  isIntoBoot():Promise<any>{
    var p = new Promise(function(resolve, reject){
      //先创建或连接数据
      this.baseSqlite.createDb().then(data=>{
        if(data.code != 0){
          resolve(false)
        }
        return this.baseSqlite.isFi()
      }).then(data=>{
        console.debug(data.toString())
        //在判断版本表是否存在
        resolve(data)
      })
    });
    return p;

  }
}
