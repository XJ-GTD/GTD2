import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";


/**
 * 验证码
 */
@Injectable()
export class SmsRestful {
  constructor(private request: RestfulClient,
              private config: RestFulConfig) {
  }


  //发送短信验证码 SSMIC
  getcode(smsData:SmsData): Promise<SmsData> {
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("SSMIC");
      this.request.post(url, smsData.repData).then(data => {
        //处理返回结果
        smsData.reqData = data;
        resolve(smsData);

      }).catch(error => {
        //处理返回错误
        smsData.errData = error;
        resolve(smsData);

      })
    });
  }

}

export class SmsData{
  reqData = {
    phoneno:"",//手机号码
  }
  repData = {
    code: "",
    message: "",
    data: {},
  }

  errData = {}
}
