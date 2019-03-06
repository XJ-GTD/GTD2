import {Injectable} from '@angular/core';
import {RestfulClient} from "./restful.client";


/**
 * 验证码
 */
@Injectable()
export class SmsRestful {
  constructor(private request: RestfulClient) {
  }


  //发送短信验证码 SSMIC
  getcode(): Promise<any> {
    return new Promise((resolve, reject) => {
    });
  }

}
