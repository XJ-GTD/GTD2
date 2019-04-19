import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {AgdPro} from "./agdsev";

/**
 * 计划
 */
@Injectable()
export class ShaeRestful{
  constructor(private request: RestfulClient,
              private config: RestFulConfig) {
  }
  //计划	计划上传	PU
  share(shaeData : ShareData):Promise<PSurl> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("PU");
      this.request.post(url, shaeData).then(data => {
        //处理返回结果
        resolve( data.d);

      }).catch(error => {
        //处理返回错误
        resolve();

      })
    });
  }


  //内建计划下载	BIPD
  downsysname(shareData : BipdshaeData):Promise<P> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("BIPD");
      this.request.post(url, shareData).then(data => {
        //处理返回结果
        resolve(data.d);

      }).catch(error => {
        //处理返回错误
        resolve();

      })
    });
  }
}

//计划上传入参
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
export class PSurl{
  psurl:string = "";
}


//内建计划下载入参
export  class BipdshaeData{
  oai : string = "";//操作帐户ID
  ompn : string = "";//操作手机号码
  c : string = "";//上下文（可以为空）
  d:SharePro = new SharePro();//日程
}

export class SharePro{
  pi : string = "";//计划ID
}
