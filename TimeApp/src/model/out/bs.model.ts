/**
 * create by on 2018/11/19
 */

import {RuEntity} from "../../entity/ru.entity";
import {AppConfig} from "../../app/app.config";
import {DataConfig} from "../../app/data.config";

//用户类
export class BsModel {

  /**
   * 数量
   */
  private _code:number = DataConfig.SUCCESS_CODE; //code
  private _message: string = DataConfig.SUCCESS_MESSAGE; //消息
  private _data:any = null;


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
  get data(): any {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }
}
