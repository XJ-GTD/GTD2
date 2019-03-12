import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";

/**
 * 验证码
 */
@Injectable()
export class SmsRestful {
  constructor(private request: RestfulClient,
              private config: RestFulConfig,) {
  }

  //发送短信验证码 SSMIC
  getcode(smsData:InData): Promise<OutData> {

    let outData:OutData = new OutData();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("SSMIC");
      this.request.post(url, smsData).then(data => {
        //处理返回结果
        outData = data;
        resolve(outData);

      }).catch(error => {
        //处理返回错误
        outData = error;
        resolve(outData);

      })
    });

  }

}

export class InData{
  phoneno:string; //手机号码
}

export class OutData{
  code: string;
  message: string;
  data:Key = new Key();
}
export class Key{
  verifykey:string;
}
