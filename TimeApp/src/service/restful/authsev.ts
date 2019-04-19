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

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("SML");
      this.request.post(url, loginData).then(data => {
        //处理返回结果
        // bsModel.code = data.errcode;
        // bsModel.message = data.errmsg;
        // bsModel.data = data.data;
        resolve(data.data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });
  }

  loginbypass(loginData: LoginData): Promise<Out> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("PL");
      this.request.post(url, loginData).then(data => {
        let out = new Out();
        out.code = data.errcode;
        out.msg = data.errmsg;
        out.data = data.data;
        resolve(out);

        //处理返回结果
        resolve(out);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });
  }

}

export class LoginData{
  phoneno:string = "";
  userpassword:string = "";
  verifykey:string = "";
  verifycode:string = "";
}

export class Out {
  code:number = 0;
  msg:string = "";
  data:OutData = new OutData();
}

export class OutData{
  code: string = "";
  openid: string = "";
  unionid: string = "";
  state:string = "";
}

