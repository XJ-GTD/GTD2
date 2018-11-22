/**
 * create by on 2018/11/19
 */

import {RuEntity} from "../../entity/ru.entity";

//用户类
export class RuoModel {

  /**
   * 数量
   */
  private _ct:number;
  private _us: Array<RuEntity>;                 //参与人

  get ct(): number {
    return this._ct;
  }

  set ct(value: number) {
    this._ct = value;
  }

  get us(): Array<RuEntity> {
    return this._us;
  }

  set us(value: Array<RuEntity>) {
    this._us = value;
  }
}
