/**
 * create by on 2018/11/19
 */
import {UModel} from "./u.model";

//用户类
export class UoModel {

  /**
   * 数量
   */
  private _ct:number;
  private _us: Array<UModel>;                 //参与人

  get ct(): number {
    return this._ct;
  }

  set ct(value: number) {
    this._ct = value;
  }

  get us(): Array<UModel> {
    return this._us;
  }

  set us(value: Array<UModel>) {
    this._us = value;
  }
}
