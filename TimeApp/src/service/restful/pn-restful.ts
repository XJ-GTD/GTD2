import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {UtilService} from "../util-service/util.service";
import {BsRestful} from "./bs-restful";



/**
 * 注册
 */
@Injectable()
export class PnRestful extends BsRestful{

  constructor(private http: HttpClient,
                private util: UtilService) {
    super()
  }


  /**
   * 注册
   * @param {string} am 手机号
   * @param {string} pw 密码
   * @param {string} ac 验证码
   * @param {string} ui uuid
   * @param {string} ai 邀请人账号
   */
  sn(am:string,pw:string,ac:string,ui:string,ai:string):Promise<any>{
    let dv = this.util.getDeviceId();
    if(dv && dv != null && dv !=''){
    }else{
      dv='1232321';
    }
    return this.bsHttp(this.http,AppConfig.PERSON_SU_URL, {
      accountMobile: am,
      password: pw,
      authCode: ac,
      accountInviter:ai,
      userId: ui
    })
  }

  /**
   * 修改密码
   * @param {string} ui 用户ID
   * @param {string} op 旧密码
   * @param {string} pw 新密码
   */
  upw(ui:string,op:string,pw:string):Promise<any>{
    return this.bsHttp(this.http,AppConfig.PERSON_UPW_URL, {
      userId: ui,
      oldPassword:op,
      password: pw
    })
  }

  /**
   * 用户搜索
   * @param {string} am 手机号
   * @param {string} tn token
   */
  su(am:string):Promise<any>{
    return this.bsHttp(this.http,AppConfig.PERSON_SU, {
      accountMobile:am
    })
  }

  /**
   * 用户添加
   * @param {string} ui 当前登录人用户ID
   * @param {string} am 添加人手机号
   * @param {string} aui 添加人用户ID
   * @returns {Promise<any>}
   */
  su(ui:string,am:string,aui:string):Promise<any>{
    return this.bsHttp(this.http,AppConfig.PERSON_ADDU, {
      userId:ui,
      targetMobile:am,
      targetUserId:aui
    })
  }

  /**
   * 更新用户资料
   * @param {string} ui 用户UUID
   * @param {string} uN 用户名称
   * @param {string} hiu 用户头像
   * @param {string} biy 用户生日
   * @param {string} rn 用户真实姓名
   * @param {string} iC 用户身份证号
   * @param {string} uS 用户性别（性别0无 1男 2女）
   * @returns {Promise<any>}
   */

  su(ui:string,uN:string,hiu:string,biy:string,rn:string,iC:string,uS:string):Promise<any>{
    return this.bsHttp(this.http,AppConfig.PERSON_UP, {
      userId:ui,
      userName:uN,
      headImgUrl:hiu,
      birthday:biy,
      realName:rn,
      idCard:iC,
      userSex: uS
    })
  }
}
