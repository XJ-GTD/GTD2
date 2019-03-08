import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";



/**
 * 日程操作
 */
@Injectable()
export class AgdRestful{
  constructor(private request: RestfulClient) {
  }


  //日程保存 AS
  save():Promise<any> {

    return new Promise((resolve, reject) => {

    });
  }

  //日程参与人保存 ACS
  contactssave():Promise<any> {

    return new Promise((resolve, reject) => {

    });
  }
  //日程获取 AG
  get():Promise<any> {

    return new Promise((resolve, reject) => {

    });
  }

  //日程删除 AR
  remove():Promise<any> {

    return new Promise((resolve, reject) => {

    });
  }


  //日程转发(分享)上传 ASU
  share():Promise<any> {
    return new Promise((resolve, reject) => {

    });
  }
}
