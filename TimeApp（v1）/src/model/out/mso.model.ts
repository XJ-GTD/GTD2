/**
 * create by on 2018/11/26
 */
import {BsModel} from "./bs.model";
import {MsEntity} from "../../entity/ms.entity";

//Message out类
export class MsoModel extends BsModel {

  private _mes: Array<MsEntity>;
  private _me: MsEntity;


  get mes(): Array<MsEntity> {
    return this._mes;
  }

  set mes(value: Array<MsEntity>) {
    this._mes = value;
  }

  get me(): MsEntity {
    return this._me;
  }

  set me(value: MsEntity) {
    this._me = value;
  }
}
