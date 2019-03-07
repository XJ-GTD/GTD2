import {Injectable} from '@angular/core';
import {RestfulClient} from "./restful.client";
import {UrlEntity, UrlUntil} from "./url.restful";


/**
 * 登录
 */
@Injectable()
export class AuthRestful {
  constructor(private request: RestfulClient, private urlUntil: UrlUntil) {
  }

  // 短信登录 SML
  loginbycode(body: any): Promise<any> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.urlUntil.getRestFulUrl("SML");
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

      let url: UrlEntity = this.urlUntil.getRestFulUrl("PL");
      this.request.post(url, body).then(data => {

        //处理返回结果
        resolve();

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });
  }

);
}

}
