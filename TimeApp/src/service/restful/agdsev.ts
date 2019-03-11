import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";



/**
 * 日程操作
 */
@Injectable()
export class AgdRestful{
  constructor(private request: RestfulClient, private config: RestFulConfig) {

  }


  //日程保存 AS
  save(agdSavePro:AgdSavePro):Promise<AgdSavePro> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AS");
      this.request.post(url, agdSavePro.reqData).then(data => {
        //处理返回结果
        agdSavePro.repData.code = data.rc;
        agdSavePro.repData.message = data.rm;
        agdSavePro.repData.data = data.d;
        resolve(agdSavePro);

      }).catch(error => {
        //处理返回错误
        agdSavePro.repData.code = "-99";
        resolve(agdSavePro);

      })
    });

  }

  //日程参与人保存 ACS
  contactssave(contactSavePro : ContactSavePro):Promise<ContactSavePro> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AS");
      this.request.post(url, contactSavePro.reqData).then(data => {
        //处理返回结果
        contactSavePro.repData.code = data.rc;
        contactSavePro.repData.message = data.rm;
        contactSavePro.repData.data = data.d;
        resolve(contactSavePro);

      }).catch(error => {
        //处理返回错误
        contactSavePro.repData.code = "-99";
        resolve(contactSavePro);

      })
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

export class AgdSavePro{
  reqData = {
    "rai": "1",
    "fc": "2",
    "ai": "3",
    "at": "4",
    "adt": "5",
    "ap": "6",
    "ar": "7",
    "aa": "8",
    "am": "9",
  }
  repData = {
    code:"",
    message:"",
    data:{},
  }
}

export class ContactSavePro{
  reqData = {
    "rai": "1",
    "fc": "2",
    "ai": "3",
    "at": "4",
    "adt": "5",
    "ap": "6",
    "ar": "7",
    "aa": "8",
    "am": "9",
  }
  repData = {
    code:"",
    message:"",
    data:{},
  }


}
