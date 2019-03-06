/**
 * create by on 2018/11/19
 */
import {BsModel} from "./bs.model";
import {JhModel} from "../jh.model";


//计划
export class JhoModel extends BsModel{
  private _jhs: Array<JhModel>;

  get jhs(): Array<JhModel> {
    return this._jhs;
  }

  set jhs(value: Array<JhModel>) {
    this._jhs = value;
  }
}
