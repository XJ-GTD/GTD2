import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
/**
 * 计划
 */
@Injectable()
export class ShaeRestful{
  constructor(private request: RestfulClient,
              private config: RestFulConfig) {
  }
  //计划	计划上传	PU
  share(shaeData : ShaeData):Promise<ShaeData> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("PU");
      this.request.post(url, shaeData.reqPUData).then(data => {
        //处理返回结果
        shaeData.repData = data;
        resolve(shaeData);

      }).catch(error => {
        //处理返回错误
        shaeData.errData = error;
        resolve(shaeData);

      })
    });
  }


  //内建计划下载	BIPD
  downsysname(shaeData : ShaeData):Promise<ShaeData> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("BIPD");
      this.request.post(url, shaeData.reqBIPDData).then(data => {
        //处理返回结果
        shaeData.repData = data;
        resolve(shaeData);

      }).catch(error => {
        //处理返回错误
        shaeData.errData = error;
        resolve(shaeData);

      })
    });
  }
}

export class ShaeData{
  reqPUData = {   //计划上传
    //操作帐户ID
    oai : "",
    //操作手机号码
    ompn:"",
    //上下文（可以为空）
    c:"",
    //日程
    d:D,
  };

  reqBIPDData = {   //内建计划下载
    //操作帐户ID
    oai : "",
    //操作手机号码
    ompn:"",
    //上下文（可以为空）
    c:"",
    //日程
    d:SharePro,
  };

  repData = {
    code: "",
    message: "",
    data: {},
  };

  errData = {}
}

export class D{
  p:P;
}

export class P{
  pn :{};
  pa :Pa;
}

export class Pa{
  ai :string;
  at :string;
  adt :string;
  ap :string;
  ar :string;
  aa :string;
  am :string;
  ac :[any];
}

export class SharePro{
  pi :string;
}
