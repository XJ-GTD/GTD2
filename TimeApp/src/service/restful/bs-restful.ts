import { Injectable } from '@angular/core';
import { DataConfig } from "../../app/data.config";
import {HttpClient} from "@angular/common/http";
import { HTTP } from "@ionic-native/http";
import { ReturnConfig } from "../../app/return.config";
import {AppConfig} from "../../app/app.config";
import {BsModel} from "../../model/out/bs.model";

/**
 * 基础resful请求
 */
@Injectable()
export class BsRestful {

  constructor(public http: HTTP,public httpClient: HttpClient){

  }

  init() {
    this.http.setDataSerializer("json");
    console.log("nocheck===================================================================");
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
  post(url:string, body:any):Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("------ 开始请求（"+url + "）-------");

      if(DataConfig.IS_MOBILE){
        if(DataConfig.IS_NETWORK_CONNECT){
            let token = '';
            if(DataConfig.uInfo.uT && DataConfig.uInfo.uT != null && DataConfig.uInfo.uT != '' && DataConfig.uInfo.uT != 'null'){
              token = DataConfig.uInfo.uT;
            }
            this.http.post(url,body,{ "Authorization": token }).then(data=>{
              let jsonData = JSON.parse(data.data);
              //获取返回值message
              jsonData.message=ReturnConfig.RETURN_MSG.get(jsonData.code+"");
              resolve(jsonData);
            }).catch(e=>{
              console.error(url + "请求头部：" + DataConfig.uInfo.uT);
              console.error(url + "请求报错：" + JSON.stringify(e));
              reject(e);
            })
          }else{
            console.error("================= 请求失败暂无网络 ==================" );
            let bs = new BsModel();
            bs.code=ReturnConfig.NOT_NETWORK_CODE;
            bs.message=ReturnConfig.NOT_NETWORK_MSG;
            resolve(bs);
          }
        }else{
          if(DataConfig.uInfo.uT){
            AppConfig.HEADER_OPTIONS_JSON.headers.Authorization=DataConfig.uInfo.uT;
          }
          this.httpClient.post(url,body,AppConfig.HEADER_OPTIONS_JSON).subscribe(data=>{

            let dataJson:any = data;
            dataJson.message=ReturnConfig.RETURN_MSG.get(dataJson.code+"");
            resolve(dataJson);
          },err => {
            console.error(url + "请求头部：" + DataConfig.uInfo.uT);
            console.error(url + "请求报错：" + JSON.stringify(err));
            reject(err)
          })
        }
    })
  }
}
