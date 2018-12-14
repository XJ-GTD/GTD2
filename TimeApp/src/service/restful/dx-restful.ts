import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {UtilService} from "../util-service/util.service";
import {BsRestful} from "./bs-restful";



/**
 * 短信
 */
@Injectable()
export class DxRestful  extends BsRestful{
  constructor(private http: HttpClient,
                private util: UtilService) {
    super()
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
