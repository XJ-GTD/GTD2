import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {AgdPro, ContactPerPro} from "./agdsev";
/**
 * 计划
 */
@Injectable()
export class ShaeRestful{
  constructor(private request: RestfulClient,
              private config: RestFulConfig) {
  }
  //计划	计划上传	PU
  share(shaeData : ShareData):Promise<ShareData> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("PU");
      this.request.post(url, shaeData).then(data => {
        //处理返回结果
        shaeData = data;
        resolve(shaeData);

      }).catch(error => {
        //处理返回错误
        shaeData = error;
        resolve(shaeData);

      })
    });
  }


  //内建计划下载	BIPD
  downsysname(shareData : BipdshaeData):Promise<RepBipdData> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("BIPD");
      let rep:RepBipdData = new RepBipdData;
      this.request.post(url, shareData).then(data => {
        //处理返回结果
        rep = data;
        resolve(rep);

      }).catch(error => {
        //处理返回错误
        rep = error;
        resolve(rep);

      })
    });
  }
}

//计划上传
export  class ShareData{
  //操作帐户ID
  oai : string;
  //操作手机号码
  ompn:string;
  //上下文（可以为空）
  c:string;
  //日程
  d:D = new D();
}

export class D{
  p:P = new P();
}

export class P{
  pn :any;
  // 计划内日程，复用日程分享实体
  pa :Array<AgdPro> =new Array<AgdPro>();
}

//计划上传出参
export  class RepSharedData{
  rc : string;
  rm : string;
  d: RepSharedDData = new RepSharedDData();
}
export class RepSharedDData{
  psurl:string;
}



//内建计划下载
export  class BipdshaeData{
  //操作帐户ID
  oai : string;
  //操作手机号码
  ompn:string;
  //上下文（可以为空）
  c:string;
  //日程
  d:SharePro = new SharePro();
}

export class SharePro{
  pi :string;
}

//内建计划下载出参
export  class RepBipdData{
  rc : string;
  rm:string;
  d:P= new P();
}
