import { Injectable } from '@angular/core';
import { AppConfig } from "../../app/app.config";
import { DataConfig } from "../../app/data.config";
import { HTTP } from '@ionic-native/http';


/**
 * 基础resful请求
 */
@Injectable()
export class BsRestful {

  constructor(private http:HTTP){
    http.setDataSerializer("json")
  }
  /**
   * http请求
   * @param {string} am 手机号
   */
  post(url:string,body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      if(DataConfig.uInfo && DataConfig.uInfo.uT){
        AppConfig.HEADER_OPTIONS_JSON.headers.Authorization=DataConfig.uInfo.uT
        console.log(url + "请求头Token：" + JSON.stringify(AppConfig.HEADER_OPTIONS_JSON))
      }else{
        console.error(url + "请求头Token未取到")
      }
      this.http.post(url,body,{ "Authorization": DataConfig.uInfo.uT }).then(data=>{
        data.data = JSON.parse(data.data)
        resolve(data)
      }).catch(e=>{
          console.error(url + "请求头部：" + JSON.stringify(AppConfig.HEADER_OPTIONS_JSON))
          console.error(url + "请求报错：" + JSON.stringify(e))
        reject(e);
      })
    })
  }
}
