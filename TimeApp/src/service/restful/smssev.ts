import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";

/**
 * 验证码
 */
@Injectable()
export class SmsRestful {
  constructor(private request: RestfulClient,private config: RestFulConfig,) {
  }

  //发送短信验证码 SSMIC
  getcode(phoneno:string): Promise<OutData> {

    return new Promise((resolve, reject) => {
      let smsData = new InData();
      smsData.phoneno = phoneno;
      let url: UrlEntity = this.config.getRestFulUrl("SSMIC");
      this.request.post(url, smsData).then(data => {
        //处理返回结果
        resolve(data.data);
      }).catch(error => {
        //处理返回错误
        reject(error);
      })
    });

  }

}

export class InData{
  phoneno:string = ""; //手机号码
  timeOut:any = 0;
}

export class OutData{
  verifykey:string;
}
