import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AlertController, LoadingController, NavController, NavParams} from "ionic-angular";
import {AppConfig} from "../../app/app.config";
import {UtilService} from "../util-service/util.service";



/**
 * 注册
 */
@Injectable()
export class PnRestfulService {
  data: any;
  user: any;
  accountName: string;
  accountPassword: string;
  constructor(private http: HttpClient,
                private util: UtilService) {

  }


  /**
   * 注册
   * @param {string} am 手机号
   * @param {string} pw 密码
   * @param {string} ac 验证码
   * @param {string} ui uuid
   * @param {string} ai 邀请人账号
   */
  sn(am:string,pw:string,ac:string,ui:string,ai:string) {
    let dv = this.util.getDeviceId;
    return this.http.post(AppConfig.PERSON_SU_URL, {
      accountMobile: am,
      password: pw,
      authCode: ac,
      accountInviter:ai,
      userId: ui
    },AppConfig.HEADER_OPTIONS_JSON)
  }

  /**
   * 修改密码
   * @param {string} ui 用户ID
   * @param {string} op 旧密码
   * @param {string} pw 新密码
   */
  upw(ui:string,op:string,pw:string) {
    return this.http.post(AppConfig.PERSON_UPW_URL, {
      userId: ui,
      oldPassword:op,
      password: pw
    },AppConfig.HEADER_OPTIONS_JSON)
  }

  /**
   * 用户搜索
   * @param {string} am 手机号
   * @param {string} tn token
   */
  su(ui:string,am:string,tn:string) {
    return this.http.post(AppConfig.PERSON_SU, {
      accountMobile:am,
      token: tn
    },AppConfig.HEADER_OPTIONS_JSON)
  }
}
