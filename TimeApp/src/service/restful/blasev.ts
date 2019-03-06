import { Injectable } from '@angular/core';
import {RestfulClient} from "./restful.client";



/**
 * 黑名单
 */
@Injectable()
export class BlaRestful{
  constructor(private request: RestfulClient) {
  }
  // 黑名单手机/帐户添加 BLA
  add():Promise<any> {

    return new Promise((resolve, reject) => {
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
