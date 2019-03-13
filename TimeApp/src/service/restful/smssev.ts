import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {BsModel} from "./out/bs.model";

/**
 * 验证码
 */
@Injectable()
export class SmsRestful {
  constructor(private request: RestfulClient,
              private config: RestFulConfig,) {
  }

  //发送短信验证码 SSMIC
  getcode(smsData:InData): Promise<BsModel<Key>> {

    let bsModel = new BsModel<Key>();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("SSMIC");
      this.request.post(url, smsData).then(data => {
        //处理返回结果
        bsModel.code = data.code;
        bsModel.message = data.message;
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

export class InData{
  phoneno:string; //手机号码
}

export class Key{
  verifykey:string;
}
