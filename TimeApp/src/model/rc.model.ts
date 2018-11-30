/**
 * create by on 2018/11/19
 */
import {BsModel} from "./out/bs.model";

//日程表
export class RcModel extends BsModel{

  private _sI: string=null;   //UUID
  private _sN:string=null; //日程名
  private _lI: string=null;   //关联标签ID
  private _lan: string=null;   //关联标签名称
  private _ji: string=null;   //关联计划ID
  private _jn: string=null;   //关联计划名称
  private _uI: string=null;          //创建人ID
  private _sd:string=null; //开始时间
  private _ed:string = null; //结束时间

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get sN(): string {
    return this._sN;
  }

  set sN(value: string) {
    this._sN = value;
  }

  get lI(): string {
    return this._lI;
  }

  set lI(value: string) {
    this._lI = value;
  }

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }


  get sd(): string {
    return this._sd;
  }

  set sd(value: string) {
    this._sd = value;
  }

  get ed(): string {
    return this._ed;
  }

  set ed(value: string) {
    this._ed = value;
  }

  get lan(): string {
    return this._lan;
  }

  set lan(value: string) {
    this._lan = value;
  }

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
}
