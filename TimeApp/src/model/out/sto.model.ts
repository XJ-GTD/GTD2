/**
 * create by on 2018/11/26
 */
import {BsModel} from "./bs.model";
import {StEntity} from "../../entity/st.entity";


//系统设置out类
export class StoModel extends BsModel {

  private _sts: Array<StEntity>;
  private _st: StEntity;


  get sts(): Array<StEntity> {
    return this._sts;
  }

  set sts(value: Array<StEntity>) {
    this._sts = value;
  }

  get st(): StEntity {
    return this._st;
  }

  set st(value: StEntity) {
    this._st = value;
  }
}
