import { Injectable } from '@angular/core';
import {RestfulClient} from "./restful.client";



/**
 * 登录
 */
@Injectable()
export class AuthRestful{
  constructor(private request: RestfulClient) {
  }

  // 短信登录 SML
  loginbycode():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

  loginbypass():Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

}
