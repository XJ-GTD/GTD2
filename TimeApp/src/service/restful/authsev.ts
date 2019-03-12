import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";

/**
 * 登录
 */
@Injectable()
export class AuthRestful {
  constructor(private request: RestfulClient,
              private config: RestFulConfig,) {
  }

  // 短信登录 SML
  loginbycode(loginData: LoginData): Promise<OutData> {

    let outData:OutData = new OutData();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("SML");
      this.request.post(url, loginData).then(data => {
        //处理返回结果
        outData = data;
        resolve(outData);

      }).catch(error => {
        //处理返回错误
        reject(error);

      })
    });
  }

  loginbypass(loginData: LoginData): Promise<OutData> {
    return new Promise((resolve, reject) => {

      let outData:OutData = new OutData();
      let url: UrlEntity = this.config.getRestFulUrl("PL");
      this.request.post(url, loginData).then(data => {
        //处理返回结果
        outData = data;
        resolve(outData);

      }).catch(error => {
        //处理返回错误
        reject(error);

      })
    });
  }

}

export class LoginData{
  phoneno:string;
  userpassword:string;
  authCode:string;
}

export class OutData{
  errcode:string;
  errmsg:string;
  code:string;
  openid:string;
  unionid:string;
  state:string;
  data:Data = new Data();
}

export class Data{
  code: string;
  openid: string;
  unionid: string;
  state:string;
}

