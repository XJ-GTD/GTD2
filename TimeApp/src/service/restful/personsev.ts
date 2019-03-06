import { Injectable } from '@angular/core';
import {RestfulClient} from "./restful.client";



/**
 * 帐户 注册
 */
@Injectable()
export class PersonRestful{

  constructor(private request: RestfulClient) {
  }

  //帐户信息更新	AIU	personsev.ts
  updateself():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }


  //帐户信息获取	AIG
  get():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

  //帐户头像获取	AAG
  getavatar():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

  //修改密码
  updatepass():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }


  //注册帐户	RA
  signup():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }


}
