/**
 * create by on 2018/11/19
 */

import {RuEntity} from "../../entity/ru.entity";
import {AppConfig} from "../../app/app.config";

//用户类
export class BsModel {

  /**
   * 数量
   */
  private _code:number = AppConfig.SUCCESS_CODE; //code
  private _message: string = AppConfig.SUCCESS_MESSAGE; //消息


  get code(): number {
    return this._code;
  }

  set code(value: number) {
    this._code = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }
}
