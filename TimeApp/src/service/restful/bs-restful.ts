import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";



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
      AppConfig.HEADER_OPTIONS_JSON.headers.Authorization=AppConfig.Token
      http.post(url,body,AppConfig.HEADER_OPTIONS_JSON).subscribe(data=>{
        resolve(data)
      },err => {
        reject(err)
      })
    })
  }
}
