/**
 * create by on 2018/11/26
 */
import {BsModel} from "./bs.model";
import {ReEntity} from "../../entity/re.entity";


//Message out类
export class ReoModel extends BsModel {


  private _res: Array<ReEntity>;
  private _re: ReEntity;


  get res(): Array<ReEntity> {
    return this._res;
  }

  set res(value: Array<ReEntity>) {
    this._res = value;
  }

  get re(): ReEntity {
    return this._re;
  }

  set re(value: ReEntity) {
    this._re = value;
  }
}
