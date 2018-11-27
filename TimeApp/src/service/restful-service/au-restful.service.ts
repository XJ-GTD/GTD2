import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {UtilService} from "../util-service/util.service";



/**
 * 登录
 */
@Injectable()
export class AuRestfulService {
  data:any;
  constructor(private http: HttpClient,
                private util: UtilService) {

  }

  /**
   * 游客登录
   * @param {string} ui UUID
   */
  visitor(ui:string) {
    let dv = this.util.getDeviceId();
    return this.http.post(AppConfig.AUTH_VISITOR_URL, {
      userId:ui,
      deviceId: dv
    },AppConfig.HEADER_OPTIONS_JSON)
  }

  /**
   * 登录
   * @param {string} un
   * @param {string} pw
   */
  login(un:string,pw:string) {
    let dv = this.util.getDeviceId();
    dv='1232321';
    return this.http.post(AppConfig.AUTH_LOGIN_URL, {
      account: un,
      password: pw,
      deviceId: dv
    },AppConfig.HEADER_OPTIONS_JSON)
  }



  /**
   * 短信登录
   * @param {string} um 手机号
   * @param {string} ac 验证码
   */
  ml(um:string,ac:string) {
    let dv = this.util.getDeviceId;
    return this.http.post(AppConfig.AUTH_SMSLOGIN_URL, {
      account: um,
      authCode: ac,
      deviceId: dv
    },AppConfig.HEADER_OPTIONS_JSON)
  }
}
