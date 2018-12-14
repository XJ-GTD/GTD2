import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {UtilService} from "../util-service/util.service";



/**
 * 日程操作
 */
@Injectable()
export class DxRestful {
  constructor(private http: HttpClient,
                private util: UtilService) {

  }

  /**
   * 短信验证码
   * @param {string} am 手机号
   */
  sc(am:string) {
    return this.http.post(AppConfig.SMS_CODE_URL, {
      accountMobile: am
    },AppConfig.HEADER_OPTIONS_JSON)
  }
}
