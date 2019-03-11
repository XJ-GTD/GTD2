import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";



/**
 * 黑名单
 */
@Injectable()
export class BlaRestful{
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }
  // 黑名单手机/帐户添加 BLA
  add(bla:Bla):Promise<Bla> {
    //Object.assign(rc,data.rows.item(i));
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("BLA");
      this.request.post(url, bla.reqData).then(data => {
        //处理返回结果
        bla.repData.code = data.rc;
        bla.repData.message = data.rm;
        bla.repData.data = data.d;
        resolve(bla);

      }).catch(error => {
        //处理返回错误
        bla.repData.code = "-99";
        resolve(bla);
      })
    });
  }


  // 黑名单手机/帐户删除 BLR
  remove():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

  //黑名单获取 BLG
  list():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

}

export class Bla {
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
}
