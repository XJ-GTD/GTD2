/**
 * create by on 2018/11/26
 */
import {BsModel} from "./bs.model";
import {RguEntity} from "../../entity/rgu.entity";
import {RguModel} from "../rgu.model";

//Message out类
export class RguoModel extends BsModel {


  private _rgus: Array<RguModel>;
  private _rgu: RguModel;


  get rgus(): Array<RguModel> {
    return this._rgus;
  }

  set rgus(value: Array<RguModel>) {
    this._rgus = value;
  }

  get rgu(): RguModel {
    return this._rgu;
  }

  set rgu(value: RguModel) {
    this._rgu = value;
  }
}
