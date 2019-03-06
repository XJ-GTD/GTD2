/**
 * create by on 2018/11/19
 */
import {BsModel} from "./out/bs.model";

//标签表
export class JhModel extends BsModel{
  private _ji: string=null;   //计划编号
  private _jn:string=null; //计划名
  private _jg: string=null; //计划描述


  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }

  get jn(): string {
    return this._jn;
  }

  set jn(value: string) {
    this._jn = value;
  }

  get jg(): string {
    return this._jg;
  }

  set jg(value: string) {
    this._jg = value;
  }
}
