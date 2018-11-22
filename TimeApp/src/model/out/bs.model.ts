/**
 * create by on 2018/11/19
 */

import {RuEntity} from "../../entity/ru.entity";

//用户类
export class BsModel {

  /**
   * 数量
   */
  private _code:number; //code
  private _message: string; //消息


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
