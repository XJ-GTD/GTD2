import {Injectable} from '@angular/core';
import {RestfulClient} from "./restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";


/**
 * 登录
 */
@Injectable()
export class AuthRestful {
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }

  // 短信登录 SML
  loginbycode(body: any): Promise<any> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("SML");
      this.request.post(url, body).then(data => {

        //处理返回结果

        resolve();

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });
  }

  loginbypass(body: any): Promise<any> {
    return new Promise((resolve, reject) => {

      let url: UrlEntity = this.config.getRestFulUrl("PL");
      this.request.post(url, body).then(data => {

        //处理返回结果
        resolve();

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });
  }

}
