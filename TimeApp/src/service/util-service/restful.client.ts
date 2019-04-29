import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { HTTP } from "@ionic-native/http";
import {UrlEntity, RestFulConfig, RestFulHeader} from "../config/restful.config";
import {UtilService} from "./util.service";
import {SqliteExec} from "./sqlite.exec";
import {LogTbl} from "../sqlite/tbl/log.tbl";

/**
 * 基础resful请求
 */
@Injectable()
export class RestfulClient {

  constructor(private http: HTTP,private httpClient:HttpClient,private restConfig:RestFulConfig,private util:UtilService,private sqlitExc:SqliteExec){
      this.init()
  }

  init(){
    if (this.util.hasCordova()){
      this.http.setDataSerializer("json");
      this.http.setSSLCertMode("nocheck").then(data=>{
      })
    }
  }

  post(url:UrlEntity, body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      let log:LogTbl = new LogTbl();
      log.id = this.util.getUuid();
      log.su = url.key;
      log.ss = new Date().valueOf();
      log.t = 1;
      let header = this.restConfig.createHeader();
        if(this.util.hasCordova()){
          return this.http.post(url.url,body,header).then(data=>{
            // console.log(data.status);
            // console.log(data.data); // data received by server
            // console.log(data.headers);
            let jsonData = JSON.parse(data.data);

            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.sqlitExc.noteLog(log);
            resolve(jsonData);
          }).catch(err=>{
            this.util.toastStart("服务" + url.desc + "访问失败" ,2000);
            log.ss = new Date().valueOf() - log.ss;
            log.st = false;
            log.er = err;
            this.sqlitExc.noteLog(log);
            reject(err);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.post(url.url,body,warHeader).subscribe(data=>{

            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.sqlitExc.noteLog(log);
            resolve(data);
          },err => {

            log.ss = new Date().valueOf() - log.ss;
            log.st = false;
            log.er = err;
            this.sqlitExc.noteLog(log);
            this.util.toastStart("服务" + url.desc + "访问失败",2000);
            reject(err)
          })
        }
      });
  }

  get(url:UrlEntity):Promise<any> {
    return new Promise((resolve, reject) => {
      let log:LogTbl = new LogTbl();
      log.id = this.util.getUuid();
      log.su = url.key;
      log.ss = new Date().valueOf();
      log.t = 1;
      let header = this.restConfig.createHeader();
        if(this.util.hasCordova()){
          return this.http.get(url.url,{},header).then(data=>{
            let jsonData = JSON.parse(data.data);
            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.sqlitExc.noteLog(log);
            resolve(jsonData);
          }).catch(err=>{

            log.ss = new Date().valueOf() - log.ss;
            log.st = false;
            log.er = err;
            this.sqlitExc.noteLog(log);
            this.util.toastStart("服务" + url.desc + "访问失败",2000);
            reject(err);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.get(url.url,warHeader).subscribe(data=>{

            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.sqlitExc.noteLog(log);
            resolve(data);
          },err => {

            log.ss = new Date().valueOf() - log.ss;
            log.st = false;
            log.er = err;
            this.sqlitExc.noteLog(log);
            this.util.toastStart("服务" + url.desc + "访问失败",2000);
            reject(err)
          })
        }
      });
  }

  put(url:UrlEntity, body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      let log:LogTbl = new LogTbl();
      log.id = this.util.getUuid();
      log.su = url.key;
      log.ss = new Date().valueOf();
      log.t = 1;
      let header = this.restConfig.createHeader();
        if(this.util.hasCordova()){
          return this.http.put(url.url,body,header).then(data=>{
            let jsonData = JSON.parse(data.data);

            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.sqlitExc.noteLog(log);
            resolve(jsonData);
          }).catch(err=>{

            log.ss = new Date().valueOf() - log.ss;
            log.st = false;
            log.er = err;
            this.sqlitExc.noteLog(log);
            this.util.toastStart("服务" + url.desc + "访问失败",2000);
            reject(err);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.put(url.url,body,warHeader).subscribe(data=>{
            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.sqlitExc.noteLog(log);
            log.t = 1;
            resolve(data);
          },err => {
            log.ss = new Date().valueOf() - log.ss;
            log.st = false;
            log.er = err;
            this.sqlitExc.noteLog(log);
            this.util.toastStart("服务" + url.desc + "访问失败",2000);
            reject(err)
          })
        }
      });
  }

  /**
   * http请求
   * @param url
   * @param header
   * @param body
   */
  specPost(url:string,header:RestFulHeader,body:any):Promise<any> {
    let log:LogTbl = new LogTbl();
    log.id = this.util.getUuid();
    log.su = url;
    log.ss = new Date().valueOf();
    log.t = 1;
    return new Promise((resolve, reject) => {
        if(this.util.hasCordova()){
          return this.http.post(url,body,header).then(data=>{
            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.sqlitExc.noteLog(log);
            resolve(JSON.parse(data.data));
          }).catch(err=>{
            log.ss = new Date().valueOf() - log.ss;
            log.st = false;
            log.er = err;
            this.sqlitExc.noteLog(log);
            this.util.toastStart("服务初始化数据访问失败",2000);
            resolve();
            //reject(e);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.post(url,body,warHeader).subscribe(data=>{
            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.sqlitExc.noteLog(log);
            resolve(data);
          },err => {
            log.ss = new Date().valueOf() - log.ss;
            log.st = false;
            log.er = err;
            this.sqlitExc.noteLog(log);
            this.util.toastStart("服务初始化数据访问失败",2000);
            resolve();
          })
        }
    });
  }

  /**
   * http请求
   * @param url
   * @param header
   * @param body
   */
  get4Text(url:string,header:RestFulHeader,body:any):Promise<any> {
    let log:LogTbl = new LogTbl();
    log.id = this.util.getUuid();
    log.su = url;
    log.ss = new Date().valueOf();
    log.t = 1;
    return new Promise((resolve, reject) => {
      header["Content-Type"] = "text/plain"
      if(this.util.hasCordova()){
        return this.http.get(url,body,header).then(data=>{
          log.ss = new Date().valueOf() - log.ss;
          log.st = true;
          this.sqlitExc.noteLog(log);
          resolve(data.data);
        }).catch(err=>{
          log.ss = new Date().valueOf() - log.ss;
          log.st = false;
          log.er = err;
          this.sqlitExc.noteLog(log);
          this.util.toastStart("服务初始化数据访问失败",2000);
          reject(err);
        })
      }else{
        //浏览器测试使用
        let warHeader:any={};
        warHeader.headers = header;
        this.httpClient.get(url,warHeader).subscribe(data=>{
          log.ss = new Date().valueOf() - log.ss;
          log.st = true;
          this.sqlitExc.noteLog(log);
          resolve(data);
        },err => {
          log.ss = new Date().valueOf() - log.ss;
          log.st = false;
          log.er = err;
          this.sqlitExc.noteLog(log);
          this.util.toastStart("服务初始化数据访问失败",2000);
          reject(err)
        })
      }
    });
  }
}
