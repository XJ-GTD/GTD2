import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";


/**
 * 登录
 */
@Injectable()
export class AuthRestful {
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }

  // 短信登录 SML
  loginbycode(loginData: LoginData): Promise<LoginData> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("SML");
      this.request.post(url, loginData.reqAData).then(data => {

        //处理返回结果
        loginData.repData = data;
        resolve(loginData);

      }).catch(error => {
        //处理返回错误
        reject(error);

      })
    });
  }

  loginbypass(loginData: LoginData): Promise<LoginData> {
    return new Promise((resolve, reject) => {

      let url: UrlEntity = this.config.getRestFulUrl("PL");
      this.request.post(url, loginData.reqPData).then(data => {

        //处理返回结果
        loginData.repData = data;
        resolve(loginData);

      }).catch(error => {
        //处理返回错误
        reject(error);

      })
    });
  }

}

export class LoginData {
  //用户密码请求登陆
  reqPData = {
    mobile:"",
    password:"",
  }

  //用户验证码请求登陆
  reqAData = {
    mobile:"",
    authCode:""
  }
  repData = {
    code:"",
    message:"",
    data:{
      "code": "",
      "openid": "",
      "unionid": "",
      "state": ""
    },
  }

  errData = {
  }
}

