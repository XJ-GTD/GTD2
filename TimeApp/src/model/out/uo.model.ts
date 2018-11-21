/**
 * create by on 2018/11/19
 */
import {UEntity} from "../../entity/u.entity";

//用户类
export class UoModel {

  /**
   * 数量
   */
  private _ct:number;
  private _us: Array<UEntity>;                 //参与人

  get ct(): number {
    return this._ct;
  }

  set ct(value: number) {
    this._ct = value;
  }

  get us(): Array<UEntity> {
    return this._us;
  }

  set us(value: Array<UEntity>) {
    this._us = value;
  }
}
