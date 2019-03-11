/**
 * create by on 2018/11/19
 */

import {DataConfig} from "../../service/config/data.config";

//用户类
export class BsModel<T> {

  /**
   * 数量
   */
  private _code:number = DataConfig.SUCCESS_CODE; //code
  private _message: string = DataConfig.SUCCESS_MESSAGE; //消息
  private _data:T = null;


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
  get data(): T {
    return this._data;
  }

  set data(value: T) {
    this._data = value;
  }
}
