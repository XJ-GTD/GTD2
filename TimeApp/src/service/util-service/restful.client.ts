import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { HTTP } from "@ionic-native/http";
import {UrlEntity, RestFulConfig, RestFulHeader} from "../config/restful.config";
import {UtilService} from "./util.service";
import {ToastController} from "ionic-angular";

/**
 * 基础resful请求
 */
@Injectable()
export class RestfulClient {

  constructor(private http: HTTP,private httpClient:HttpClient,private restConfig:RestFulConfig,private util:UtilService,private toastCtrl: ToastController){
      this.init()
  }

  init(){
    if (this.util.hasCordova()){
      this.http.setDataSerializer("json");
      this.http.setSSLCertMode("nocheck").then(data=>{
        console.log("----------- BsRestful setSSLCertMode Success : "  +  JSON.stringify(data));
      })
    }
  }

  post(url:UrlEntity, body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      let header = this.restConfig.createHeader();
        if(this.util.hasCordova()){
          return this.http.post(url.url,body,header).then(data=>{
            // console.log(data.status);
            // console.log(data.data); // data received by server
            // console.log(data.headers);
            let jsonData = JSON.parse(data.data);
            resolve(jsonData);
          }).catch(e=>{
            this.util.toast("服务" + url.desc + "访问失败" + e.error,2000);
            reject(e);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.post(url.url,body,warHeader).subscribe(data=>{
            resolve(data);
          },err => {
            this.util.toast("服务" + url.desc + "访问失败",2000);
            reject(err)
          })
        }
      });
  }

  get(url:UrlEntity):Promise<any> {
    return new Promise((resolve, reject) => {
      let header = this.restConfig.createHeader();
        if(this.util.hasCordova()){
          return this.http.get(url.url,{},header).then(data=>{
            console.log(data.status);
            console.log(data.data); // data received by server
            console.log(data.headers);
            let jsonData = JSON.parse(data.data);
            resolve(jsonData);
          }).catch(e=>{
            this.util.toast("服务" + url.desc + "访问失败",2000);
            reject(e);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.get(url.url,warHeader).subscribe(data=>{
            resolve(data);
          },err => {
            this.util.toast("服务" + url.desc + "访问失败",2000);
            reject(err)
          })
        }
      });
  }

  put(url:UrlEntity, body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      let header = this.restConfig.createHeader();
        if(this.util.hasCordova()){
          return this.http.put(url.url,body,header).then(data=>{
            console.log(data.status);
            console.log(data.data); // data received by server
            console.log(data.headers);
            let jsonData = JSON.parse(data.data);
            resolve(jsonData);
          }).catch(e=>{
            this.util.toast("服务" + url.desc + "访问失败",2000);
            reject(e);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.put(url.url,warHeader).subscribe(data=>{
            resolve(data);
          },err => {
            this.util.toast("服务" + url.desc + "访问失败",2000);
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
    return new Promise((resolve, reject) => {
        if(this.util.hasCordova()){
          return this.http.post(url,body,header).then(data=>{
            resolve(JSON.parse(data.data));
          }).catch(e=>{
            this.util.toast("服务初始化数据访问失败",2000);
            //reject(e);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.post(url,body,warHeader).subscribe(data=>{
            resolve(data);
          },err => {
            this.util.toast("服务初始化数据访问失败",2000);
            //reject(err)
          })
        }
    });
  }
}
