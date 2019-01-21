import { Injectable } from '@angular/core';
import { AppConfig } from "../../app/app.config";
import { BsRestful } from "./bs-restful";
import {BsModel} from "../../model/out/bs.model";



/**
 * 注册
 */
@Injectable()
export class PnRestful{

  constructor(private bs: BsRestful) {

  }


  /**
   * 注册
   * @param {string} am 手机号
   * @param {string} pw 密码
   * @param {string} ac 验证码
   * @param {string} ui uuid
   * @param {string} ai 邀请人账号
   */
  sn(am:string,pw:string,ac:string,ui:string,ai:string,dv:string):Promise<any>{
    return this.bs.post(AppConfig.PERSON_SU_URL, {
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
    return this.bs.post(AppConfig.PERSON_UPW_URL, {
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
    let data:any = [];
    let sub:any={};
    sub.targetMobile = am;
    data.push(sub);
    return this.bs.post(AppConfig.PERSON_SU, {
      playerList:data
    })
  }

  /**
   * 用户搜索
   * @param {string} am 手机号
   * @param {string} tn token
   */
  sus(ams:Array<string>):Promise<any>{
    let data:any = [];
    for(let am of ams){
      let sub:any={};
      sub.targetMobile = am;
      data.push(sub);
    }
    return this.bs.post(AppConfig.PERSON_SU, {
      playerList:data
    })
  }

  /**
   * 添加联系人发送邀请单个
   * @param {string} ui 当前登录人用户ID
   * @param {string} am 添加人手机号
   * @param {string} aui 添加人用户ID
   * @returns {Promise<any>}
   */
  au(ui:string,am:string,aui:string):Promise<any>{
    let playerList = new Array<any>();
    let player:any = new BsModel();
    player.targetUserId =aui;
    player.targetMobile =am;
    playerList.push(player);
    return this.bs.post(AppConfig.PERSON_ADDU, {
      userId:ui,
      playerList:playerList
    })
  }
  /**
   * 添加联系人发送邀请多个
   * @param {string} ui 当前登录人用户ID
   * @param {string} am 添加人手机号
   * @param {string} aui 添加人用户ID
   * @returns {Promise<any>}
   */
  aus(ui:string,playerList:Array<any>):Promise<any>{
    return this.bs.post(AppConfig.PERSON_ADDU, {
      userId:ui,
      playerList:playerList
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

  upu(ui:string,uN:string,hiu:string,biy:string,rn:string,iC:string,uS:string):Promise<any>{
    return this.bs.post(AppConfig.PERSON_UP, {
      userId:ui,
      userName:uN,
      headImgUrl:hiu,
      birthday:biy,
      realName:rn,
      idCard:iC,
      userSex: uS
    })
  }

  /**
   * 服务器添加联系人
   * @param {string} id 联系人主键
   * @param {string} ui 当前登录人ID
   * @param {string} ona 备注
   * @param {string} am  电话
   * @param {string} aui 联系人用户ID
   * @param {string} aN 联系人名称
   * @param {string} hi 头像
   * @param {string} rF 参与人权限 0不接收 1接收
   * @param {string} pt 参与人类型 0未注册用户 1注册用户
   * @returns {Promise<any>}
   */
  addPlayers(id:string,ui:string,ona:string,am:string,aui:string,aN:string,hi:string,rF:string,pt:string):Promise<any>{
    return this.bs.post(AppConfig.SYNC_TEMP_URL, {
      id:id,
      userId:ui,
      otherName:ona,
      accountMobile:am,
      playerId:aui,
      playerName:aN,
      headImg:hi,
      playerFlag:rF,
      playerType:pt
    })
  }
}
