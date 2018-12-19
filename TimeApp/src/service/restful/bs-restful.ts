import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {DataConfig} from "../../app/data.config";



/**
 * 基础resful请求
 */
@Injectable()
export class BsRestful {
  /**
   * http请求
   * @param {string} am 手机号
   */
  bsHttp(http:HttpClient,url:string,body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      if(DataConfig.uInfo && DataConfig.uInfo.uT){
        AppConfig.HEADER_OPTIONS_JSON.headers.Authorization=DataConfig.uInfo.uT
        console.log(url + "请求头Token：" + JSON.stringify(AppConfig.HEADER_OPTIONS_JSON))
      }else{
        console.error(url + "请求头Token未取到")
      }

      http.post(url,body,AppConfig.HEADER_OPTIONS_JSON).subscribe(data=>{
        resolve(data)
      },err => {
        console.error(url + "请求头部：" + JSON.stringify(AppConfig.HEADER_OPTIONS_JSON))
        console.error(url + "请求报错：" + JSON.stringify(err))
        reject(err)
      })
    })
  }
}
