/**
 * create by on 2018/11/22
 */

import {RuEntity} from "../../entity/ru.entity";
import {BsModel} from "./bs.model";
import {MbsModel} from "../mbs.model";

/**
 * 当月显示事件标识
 */
export class MbsoModel extends BsModel{

  private _bs: Array<MbsModel>;

  get bs(): Array<MbsModel> {
    return this._bs;
  }

  set bs(value: Array<MbsModel>) {
    this._bs = value;
  }
}
