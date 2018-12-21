/**
 * create by on 2018/11/19
 */
import {BsModel} from "./out/bs.model";

//授权联系人表实体
export class RuModel extends BsModel{

  private _id: string=null;   //UUID
  private _ran:string=null; //别名
  private _rI: string=null;  //关联ID
  private _rN: string=null;  //名称
  private _rC: string=null;  // 联系方式
  private _rF: string=null;     // 授权标识0未授权1授权
  private _rel: string=null; // 联系类型
  private _hiu: string=null; // 联系人头像URL
  private _sdt: number = 0; //日程是否发送状态;0未发送，1同意发送，2拒绝发送，3未注册
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get ran(): string {
    return this._ran;
  }

  set ran(value: string) {
    this._ran = value;
  }

  get rI(): string {
    return this._rI;
  }

  set rI(value: string) {
    this._rI = value;
  }

  get rN(): string {
    return this._rN;
  }

  set rN(value: string) {
    this._rN = value;
  }

  get rC(): string {
    return this._rC;
  }

  set rC(value: string) {
    this._rC = value;
  }

  get rF(): string {
    return this._rF;
  }

  set rF(value: string) {
    this._rF = value;
  }

  get rel(): string {
    return this._rel;
  }

  set rel(value: string) {
    this._rel = value;
  }

  get hiu(): string {
    return this._hiu;
  }

  set hiu(value: string) {
    this._hiu = value;
  }

  get sdt(): number {
    return this._sdt;
  }

  set sdt(value: number) {
    this._sdt = value;
  }
}
