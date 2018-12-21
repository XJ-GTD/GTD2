import { Injectable } from '@angular/core';

import {AppConfig} from "../../app/app.config";
import {UtilService} from "../util-service/util.service";
import {BsRestful} from "./bs-restful";

import { HTTP } from '@ionic-native/http';


/**
 * 登录
 */
@Injectable()
export class AuRestful extends BsRestful{
  constructor(private http: HTTP,private util: UtilService) {
    super()
  }

  /**
   * 游客登录
   * @param {string} ui UUID
   */
  visitor(ui:string):Promise<any> {
    let dv = this.util.getDeviceId();
    if(dv && dv != null && dv !=''){

    }else{
      dv='1232321';
    }
    return this.bsHttp(this.http,AppConfig.AUTH_VISITOR_URL, {
      userId:ui,
      deviceId: dv
    })
  }

  /**
   * 登录
   * @param {string} un
   * @param {string} pw
   */
  login(un:string,pw:string):Promise<any> {
    let dv = this.util.getDeviceId();
    if(dv && dv != null && dv !=''){
    }else{
      dv='1232321';
    }
    return this.bsHttp(this.http,AppConfig.AUTH_LOGIN_URL, {
      account: un,
      password: pw,
      deviceId: dv
    })
  }



  /**
   * 短信登录
   * @param {string} um 手机号
   * @param {string} ac 验证码
   */
  ml(um:string,ac:string):Promise<any> {
    let dv = this.util.getDeviceId;
    return this.bsHttp(this.http,AppConfig.AUTH_SMSLOGIN_URL, {
      account: um,
      authCode: ac,
      deviceId: dv
    })
  }
}
