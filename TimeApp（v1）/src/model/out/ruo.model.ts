/**
 * create by on 2018/11/19
 */

import {RuEntity} from "../../entity/ru.entity";
import {BsModel} from "./bs.model";
import {RuModel} from "../ru.model";

//用户类
export class RuoModel extends BsModel{

  /**
   * 数量
   */
  private _ct:number;
  private _us: Array<RuModel>;                 //参与人List
  private _u: RuModel; //当前参与人
  get ct(): number {
    return this._ct;
  }

  set ct(value: number) {
    this._ct = value;
  }

  get us(): Array<RuModel> {
    return this._us;
  }

  set us(value: Array<RuModel>) {
    this._us = value;
  }

  get u(): RuModel {
    return this._u;
  }

  set u(value: RuModel) {
    this._u = value;
  }
}
