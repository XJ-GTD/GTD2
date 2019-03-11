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
        if (data.d && data.d.length > 0 ){
          bsModel.data.rai = data.d[0].rai;
          bsModel.data.fc = data.d[0].fc;
          bsModel.data.ai = data.d[0].ai;
          bsModel.data.at = data.d[0].at;
          bsModel.data.adt = data.d[0].adt;
          bsModel.data.ap = data.d[0].ap;
          bsModel.data.ar = data.d[0].ar;
          bsModel.data.aa = data.d[0].aa;
          bsModel.data.am = data.d[0].aa;
          bsModel.data.ac = data.d[0].ac;
        }
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
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
        bsModel.data.asurl = data.d.asurl;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        resolve(bsModel);

      })
    });
  }
}

//日程
export class AgdPro{
  //关联日程ID
  private _rai: string;
  //日程发送人用户ID
  private _fc: string;
  //日程ID
  private _ai: string;
  //主题
  private _at: string;
  //时间(YYYY/MM/DD HH:mm)
  private _adt: string;
  //计划
  private _ap: string;
  //重复
  private _ar: string;
  //提醒
  private _aa: string;
  //备注
  private _am: string;
  //参与人
  private _ac:Array<ContactPerPro>;

  get ac(): Array<ContactPerPro> {
    return this._ac;
  }

  set ac(value: Array<ContactPerPro>) {
    this._ac = value;
  }

  get rai(): string {
    return this._rai;
  }

  set rai(value: string) {
    this._rai = value;
  }

  get fc(): string {
    return this._fc;
  }

  set fc(value: string) {
    this._fc = value;
  }

  get ai(): string {
    return this._ai;
  }

  set ai(value: string) {
    this._ai = value;
  }

  get at(): string {
    return this._at;
  }

  set at(value: string) {
    this._at = value;
  }

  get adt(): string {
    return this._adt;
  }

  set adt(value: string) {
    this._adt = value;
  }

  get ap(): string {
    return this._ap;
  }

  set ap(value: string) {
    this._ap = value;
  }

  get ar(): string {
    return this._ar;
  }

  set ar(value: string) {
    this._ar = value;
  }

  get aa(): string {
    return this._aa;
  }

  set aa(value: string) {
    this._aa = value;
  }

  get am(): string {
    return this._am;
  }

  set am(value: string) {
    this._am = value;
  }
}


//参与人
export class ContactPerPro{
  //帐户ID
  private _ac: string;
  //手机号码
  private _mpn: string;
  //姓名
  private _n: string;
  //头像
  private _a: string;
  //性别
  private _s: string;
  //生日
  private _bd: string;


  get ac(): string {
    return this._ac;
  }

  set ac(value: string) {
    this._ac = value;
  }

  get mpn(): string {
    return this._mpn;
  }

  set mpn(value: string) {
    this._mpn = value;
  }

  get n(): string {
    return this._n;
  }

  set n(value: string) {
    this._n = value;
  }

  get a(): string {
    return this._a;
  }

  set a(value: string) {
    this._a = value;
  }

  get s(): string {
    return this._s;
  }

  set s(value: string) {
    this._s = value;
  }

  get bd(): string {
    return this._bd;
  }

  set bd(value: string) {
    this._bd = value;
  }
}

//日程分享
export class SharePro{
  //操作帐户ID
  private _oai :string;
  //操作手机号码
  private _ompn:string;
  //
  private _c:object;

  //日程
  private _d:ShareProSub;

  get oai(): string {
    return this._oai;
  }

  set oai(value: string) {
    this._oai = value;
  }

  get ompn(): string {
    return this._ompn;
  }

  set ompn(value: string) {
    this._ompn = value;
  }

  get c(): object {
    return this._c;
  }

  set c(value: object) {
    this._c = value;
  }

  get d(): ShareProSub {
    return this._d;
  }

  set d(value: ShareProSub) {
    this._d = value;
  }
}

export class ShareProSub{

  private _a :AgdPro;

  get a(): AgdPro {
    return this._a;
  }

  set a(value: AgdPro) {
    this._a = value;
  }
}


export class OutSharePro{

  private _asurl :string;

  get asurl(): string {
    return this._asurl;
  }

  set asurl(value: string) {
    this._asurl = value;
  }
}
