import {Component, Injectable} from '@angular/core';
import {componentFactoryName} from "@angular/compiler";

/**
 * 整体配置Service
 */
@Injectable()
@Component({
  providers: []
})
export class ConfigService {
  constructor() {
  }

  initDataBase():Promise<any>{
    var p = new Promise(function(resolve, reject){

      //连接数据

    }).then(data=>{
      //检查有没有数据表

    }).then(data=>{
      //没有表创建表结构

      //存在数据表


    }).then(data=>{
      //初始化数据
    });
    return p;
  }

  connectSqlLite():Promise<any>{
    var p = new Promise(function(resolve, reject){

    });
    return p;
  }

  isIntoBoot():Promise<any>{
    var p = new Promise(function(resolve, reject){
      resolve(false);
    });
    return p;

  }
}
