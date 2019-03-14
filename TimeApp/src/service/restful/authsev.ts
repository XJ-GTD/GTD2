import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {BsModel} from "./out/bs.model";

/**
 * 登录
 */
@Injectable()
export class AuthRestful {
  constructor(private request: RestfulClient,
              private config: RestFulConfig,) {
  }

  // 短信登录 SML
  loginbycode(loginData: LoginData): Promise<BsModel<OutData>> {

    let bsModel = new BsModel<OutData>();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("SML");
      this.request.post(url, loginData).then(data => {
        //处理返回结果
        bsModel.code = data.errcode;
        bsModel.message = data.errmsg;
        bsModel.data = data.data;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        reject(bsModel);

      })
    });
  }

  loginbypass(loginData: LoginData): Promise<BsModel<OutData>> {

    let bsModel = new BsModel<OutData>();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("PL");
      this.request.post(url, loginData).then(data => {
        //处理返回结果
        bsModel.code = data.errcode;
        bsModel.message = data.errmsg;
        bsModel.data = data.data;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        reject(bsModel);

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

export class OutData{
  code: string = "";
  openid: string = "";
  unionid: string = "";
  state:string = "";
}

