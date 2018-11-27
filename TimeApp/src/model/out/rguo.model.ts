/**
 * create by on 2018/11/26
 */
import {BsModel} from "./bs.model";
import {RguEntity} from "../../entity/rgu.entity";

//Message out类
export class RguoModel extends BsModel {


  private _rgus: Array<RguEntity>;
  private _rgu: RguEntity;


  get rgus(): Array<RguEntity> {
    return this._rgus;
  }

  set rgus(value: Array<RguEntity>) {
    this._rgus = value;
  }

  get rgu(): RguEntity {
    return this._rgu;
  }

  set rgu(value: RguEntity) {
    this._rgu = value;
  }
}
