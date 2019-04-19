import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";


/**
 * 黑名单
 */
@Injectable()
export class BlaRestful {
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }

  // 黑名单手机/帐户添加 BLA
  add(bla: BlaReq): Promise<BlaReq> {
    //Object.assign(rc,data.rows.item(i));
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("BLA");
      this.request.post(url, bla).then(data => {

        //处理返回结果
        resolve(data.d);

      }).catch(error => {
        //处理返回错误
        resolve();
      })
    });
  }


  // 黑名单手机/帐户删除 BLR
  remove(bla: BlaReq): Promise<BlaReq> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("BLR");
      this.request.post(url, bla).then(data => {
        //处理返回结果
        resolve();

      }).catch(error => {
        //处理返回错误
        resolve();
      })
    });
  }

  //黑名单获取 BLG
  list(): Promise<Array<BlaReq>> {
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("BLG");
      this.request.post(url, {}).then(data => {
        //处理返回结果
        resolve(data.d);

      }).catch(error => {
        //处理返回错误
        resolve();
      })
    });
  }

}

/*export class Bla {
  reqData = {
    "ai": "15737921611",
    "mpn": "15737921611",
    "n": "15737921611",
    "a": "15737921611",
    "s": "15737921611",
    "bd": "15737921611"
  }
  repData = {
    code: "",
    message: "",
    data: {},
  }
}*/

//参与人
export class BlaReq {
  //帐户ID
  ai: string;
  //手机号码
  mpn: string;
  //姓名
  n: string;
  //头像
  a: string;
  //性别
  s: string;
  //生日
  bd: string;

}

