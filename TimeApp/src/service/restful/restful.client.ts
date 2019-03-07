import { Injectable } from '@angular/core';
import { DataConfig } from "../../app/data.config";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { HTTP } from "@ionic-native/http";
import {RestFulConfig} from "./restful.config";
import {UrlEntity} from "./url.restful";

/**
 * 基础resful请求
 */
@Injectable()
export class RestfulClient {

  constructor(private http: HTTP,private httpClient:HttpClient,private config:RestFulConfig){
    this.http.setDataSerializer("json");
    this.http.setSSLCertMode("nocheck").then(data=>{
      console.log("----------- BsRestful setSSLCertMode Success : "  +  JSON.stringify(data));
    }).catch(err=>{
      console.error("----------- BsRestful setSSLCertMode Error: " + JSON.stringify(err))
    });
  }

  /**
   * http请求
   * @param {string} am 手机号
   */
  post(url:UrlEntity, body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      let header = this.config.createHeader();
      if(DataConfig.IS_MOBILE){
         return this.http.post(url.url,body,header).then(data=>{
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
        warHeader.header = header;
          this.httpClient.post(url.url,body,warHeader).subscribe(data=>{
            resolve(data);
          },err => {
            reject(err)
          })
        }
    })
  }
}
