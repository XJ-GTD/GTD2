import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { HTTP } from "@ionic-native/http";
import {UrlEntity, RestFulConfig, RestFulHeader} from "../config/restful.config";
import {UtilService} from "./util.service";

/**
 * 基础resful请求
 */
@Injectable()
export class RestfulClient {

  constructor(private http: HTTP,private httpClient:HttpClient,private restConfig:RestFulConfig,private util:UtilService){
    this.http.setDataSerializer("json");
    this.http.setSSLCertMode("nocheck").then(data=>{
      console.log("----------- BsRestful setSSLCertMode Success : "  +  JSON.stringify(data));
    }).catch(err=>{
      console.error("----------- BsRestful setSSLCertMode Error: " + JSON.stringify(err))
    });
  }

  post(url:UrlEntity, body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      this.restConfig.createHeader().then(header=>{
        if(this.util.isMobile()){
          return this.http.post(url.url,body,header).then(data=>{
            console.log(data.status);
            console.log(data.data); // data received by server
            console.log(data.headers);
            let jsonData = JSON.parse(data.data);
            resolve(jsonData);
          }).catch(e=>{
            reject(e);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.post(url.url,body,warHeader).subscribe(data=>{
            resolve(data);
          },err => {
            reject(err)
          })
        }
      });
    })
  }

  get(url:UrlEntity):Promise<any> {
    return new Promise((resolve, reject) => {
      this.restConfig.createHeader().then(header=>{
        if(this.util.isMobile()){
          return this.http.get(url.url,{},header).then(data=>{
            console.log(data.status);
            console.log(data.data); // data received by server
            console.log(data.headers);
            let jsonData = JSON.parse(data.data);
            resolve(jsonData);
          }).catch(e=>{
            reject(e);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.get(url.url,warHeader).subscribe(data=>{
            resolve(data);
          },err => {
            reject(err)
          })
        }
      });
    })
  }

  put(url:UrlEntity, body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      this.restConfig.createHeader().then(header=>{
        if(this.util.isMobile()){
          return this.http.put(url.url,body,header).then(data=>{
            console.log(data.status);
            console.log(data.data); // data received by server
            console.log(data.headers);
            let jsonData = JSON.parse(data.data);
            resolve(jsonData);
          }).catch(e=>{
            reject(e);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.put(url.url,warHeader).subscribe(data=>{
            resolve(data);
          },err => {
            reject(err)
          })
        }
      });
    })
  }

  /**
   * http请求
   * @param url
   * @param header
   * @param body
   */
  specPost(url:string,header:RestFulHeader,body:any):Promise<any> {
    return new Promise((resolve, reject) => {
        if(this.util.isMobile()){
          return this.http.post(url,body,header).then(data=>{
            console.log(data.status);
            console.log(data.data); // data received by server
            console.log(data.headers);
            resolve(data.data);
          }).catch(e=>{
            reject(e);
          })
        }else{
          //浏览器测试使用
          let warHeader:any={};
          warHeader.headers = header;
          this.httpClient.post(url,body,warHeader).subscribe(data=>{
            resolve(data);
          },err => {
            reject(err)
          })
        }
    });
  }
}
