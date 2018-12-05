/**
 * create by on 2018/11/19
 */
import {BsModel} from "./out/bs.model";

//标签表
export class LbModel extends BsModel{

  private _lai: string=null;   //主键
  private _lan:string=null; //标签名
  private _lat: string=null;//标签类型
  private _lau: string=null; //标签功能

  get lai(): string {
    return this._lai;
  }

  set lai(value: string) {
    this._lai = value;
  }

  get lan(): string {
    return this._lan;
  }

  set lan(value: string) {
    this._lan = value;
  }

  get lat(): string {
    return this._lat;
  }

  set lat(value: string) {
    this._lat = value;
  }

  get lau(): string {
    return this._lau;
  }

  set lau(value: string) {
    this._lau = value;
  }
}
