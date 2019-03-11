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

//日程
export class AgdPro{

  private _rai: string;
  private _fc: string;
  private _ai: string;
  private _at: string;
  private _adt: string;
  private _ap: string;
  private _ar: string;
  private _aa: string;
  private _am: string;
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
  private _ac: string;
  private _ai: string;
  private _mpn: string;
  private _n: string;
  private _a: string;
  private _s: string;
  private _bd: string;


  get ac(): string {
    return this._ac;
  }

  set ac(value: string) {
    this._ac = value;
  }

  get ai(): string {
    return this._ai;
  }

  set ai(value: string) {
    this._ai = value;
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
