import {Injectable} from '@angular/core';
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
  downsysname(shareData : BipdshaeData):Promise<Plan> {

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
  p:Plan = new Plan();
}

export class Plan{
  pn :any;
  // 计划内日程，复用日程分享实体
  pa :Array<PlanPa> =new Array<PlanPa>();
}

//日程
export class PlanPa{
  //关联日程ID
  rai: string;
  //日程发送人用户ID
  fc: string;
  //日程ID
  ai: string;
  //主题
  at: string;
  //时间(YYYY/MM/DD)
  adt: string;
  //开始时间
  st:string;
  //结束日期
  ed:string;
  //结束时间
  et:string;
  //计划
  ap: string;
  //重复
  ar: string;
  //提醒
  aa: string;
  //备注
  am: string;
  px: number; //优先级
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
