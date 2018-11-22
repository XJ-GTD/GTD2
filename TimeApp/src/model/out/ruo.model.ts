/**
 * create by on 2018/11/19
 */

import {RuEntity} from "../../entity/ru.entity";
import {BsModel} from "./bs.model";

//用户类
export class RuoModel extends BsModel{

  /**
   * 数量
   */
  private _ct:number;
  private _us: Array<RuEntity>;                 //参与人List
  private _u: RuEntity; //当前参与人
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

  get u(): RuEntity {
    return this._u;
  }

  set u(value: RuEntity) {
    this._u = value;
  }
}
