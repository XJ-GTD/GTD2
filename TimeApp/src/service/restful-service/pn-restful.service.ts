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
   */
  sn(am:string,pw:string,ac:string,ui:string) {
    let dv = this.util.getDeviceId;
    return this.http.post(AppConfig.PERSON_SU_URL, {
      accountMobile: am,
      password: pw,
      authCode: ac,
      userId: ui
    },AppConfig.HEADER_OPTIONS_JSON)
  }

  /**
   * 修改密码
   * @param {string} un
   * @param {string} pw
   */
  upw(ui:string,pw:string) {
    let dv = this.util.getDeviceId;
    return this.http.post(AppConfig.AUTH_LOGIN_URL, {
      userId: ui,
      password: pw
    },AppConfig.HEADER_OPTIONS_JSON)

  }
}
