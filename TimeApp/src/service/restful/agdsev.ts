import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {BsModel} from "./out/bs.model";



/**
 * 日程操作
 */
@Injectable()
export class AgdRestful{
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }


  //日程保存 AS
  save(adgPro:AgdPro):Promise<BsModel<any>> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AS");
      let bsModel = new BsModel<any>();
      this.request.post(url, adgPro).then(data => {
        //处理返回结果
        bsModel.code = data.rc;
        bsModel.message = data.rm;
        bsModel.data = data.d;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        resolve(bsModel);

      })
    });

  }

  //日程参与人保存 ACS
  contactssave(adgPro : AgdPro):Promise<BsModel<any>> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("ACS");
      let bsModel = new BsModel<any>();
      this.request.post(url, adgPro).then(data => {
        //处理返回结果
        bsModel.code = data.rc;
        bsModel.message = data.rm;
        bsModel.data = data.d;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        resolve(bsModel);

      })
    });
  }
  //日程获取 AG
  get(adgPro : AgdPro):Promise<BsModel<AgdPro>> {
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AG");
      let bsModel = new BsModel<AgdPro>();
      this.request.post(url, adgPro).then(data => {
        //处理返回结果
        bsModel.code = data.rc;
        bsModel.message = data.rm;
        bsModel.data = data.d;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        resolve(bsModel);

      })
    });
  }

  //日程删除 AR
  remove(adgPro : AgdPro):Promise<BsModel<any>> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AR");
      let bsModel = new BsModel<any>();
      this.request.post(url, adgPro).then(data => {
        //处理返回结果
        bsModel.code = data.rc;
        bsModel.message = data.rm;
        bsModel.data = data.d;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        resolve(bsModel);

      })
    });
  }


  //日程转发(分享)上传 ASU
  share(sharePro : SharePro):Promise<BsModel<OutSharePro>> {
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("ASU");
      let bsModel = new BsModel<OutSharePro>();
      this.request.post(url, sharePro).then(data => {
        //处理返回结果
        bsModel.code = data.rc;
        bsModel.message = data.rm;
        bsModel.data = data.d;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        resolve(bsModel);

      })
    });
  }
}

//日程
export class AgdPro{
  //关联日程ID
  rai: string;
  //日程发送人用户ID
  fc: string;
  //日程ID
  ai: string;
  //主题
  at: string;
  //时间(YYYY/MM/DD HH:mm)
  adt: string;
  //计划
  ap: string;
  //重复
  ar: string;
  //提醒
  aa: string;
  //备注
  am: string;
  //重复类型日程的父ID
  pni: string;
  //参与人
  ac:Array<ContactPerPro> =new Array<ContactPerPro>();

}


//参与人
export class ContactPerPro{
  //帐户ID
  ai: string="";
  //手机号码
  mpn: string="";
  //姓名
  n: string="";
  //头像
  a: string="";
  //性别
  s: string="";
  //生日
  bd: string="";

}

//日程分享
export class SharePro{
  //操作帐户ID
  oai :string="";
  //操作手机号码
  ompn:string="";
  //上下文（可以为空）
  c:any="";
  //日程
  d:ShareProSub = new ShareProSub();
}

export class ShareProSub{

  a :AgdPro = new AgdPro();


}


export class OutSharePro{

  asurl :string="";

}
