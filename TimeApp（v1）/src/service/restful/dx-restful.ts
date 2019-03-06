import { Injectable } from '@angular/core';
import { AppConfig } from "../../app/app.config";
import { UtilService } from "../util-service/util.service";
import { BsRestful } from "./bs-restful";



/**
 * 短信
 */
@Injectable()
export class DxRestful{
  constructor(private bs: BsRestful,
                private util: UtilService) {
  }

  /**
   * 短信验证码
   * @param {string} am 手机号
   */
  sc(am:string):Promise<any>{
    return this.bs.post(AppConfig.SMS_CODE_URL, {
      accountMobile: am
    })
  }
}
