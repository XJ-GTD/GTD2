/**
 * create by on 2018/11/19
 */
import {UEntity} from "../../entity/u.entity";
import {BsModel} from "./bs.model";

//用户类
export class UoModel extends BsModel{

  /**
   * 数量
   */
  private _ct:number;
  private _us: Array<UEntity>;
  private _u: UEntity;
  get ct(): number {
    return this._ct;
  }

  set ct(value: number) {
    this._ct = value;
  }

  get us(): Array<UEntity> {
    return this._us;
  }

  set us(value: Array<UEntity>) {
    this._us = value;
  }

  get u(): UEntity {
    return this._u;
  }

  set u(value: UEntity) {
    this._u = value;
  }
}
