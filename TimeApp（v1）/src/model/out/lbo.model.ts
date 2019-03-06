/**
 * create by on 2018/11/19
 */
import {BsModel} from "./bs.model";
import {LbModel} from "../lb.model";


//标签
export class LboModel extends BsModel{
  private _lbs: Array<LbModel>;

  get lbs(): Array<LbModel> {
    return this._lbs;
  }

  set lbs(value: Array<LbModel>) {
    this._lbs = value;
  }
}
