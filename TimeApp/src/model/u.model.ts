/**
 * create by on 2018/11/19
 */
import {BsModel} from "./out/bs.model";

//用户类
export class UModel extends BsModel{

  private _uI: string=null;   //用户ID
  private _oUI:string=null; //原用户ID
  private _uN: string=null;   //昵称
  private _hIU: string=null;          //头像URL
  private _biy: string=null;    // 生日
  private _uS: string=null;     // 性别
  private _uCt: string=null; // 联系方式
  private _aQ: string=null;    //消息队列
  private _uT:string=null; //token
  private _uty:string=null;//0游客1正式用户
  private _rn: string=null;   //真实姓名

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }

  get oUI(): string {
    return this._oUI;
  }

  set oUI(value: string) {
    this._oUI = value;
  }

  get uN(): string {
    return this._uN;
  }

  set uN(value: string) {
    this._uN = value;
  }

  get hIU(): string {
    return this._hIU;
  }

  set hIU(value: string) {
    this._hIU = value;
  }

  get biy(): string {
    return this._biy;
  }

  set biy(value: string) {
    this._biy = value;
  }

  get uS(): string {
    return this._uS;
  }

  set uS(value: string) {
    this._uS = value;
  }

  get uCt(): string {
    return this._uCt;
  }

  set uCt(value: string) {
    this._uCt = value;
  }

  get aQ(): string {
    return this._aQ;
  }

  set aQ(value: string) {
    this._aQ = value;
  }

  get uT(): string {
    return this._uT;
  }

  set uT(value: string) {
    this._uT = value;
  }

  get uty(): string {
    return this._uty;
  }

  set uty(value: string) {
    this._uty = value;
  }

  get rn(): string {
    return this._rn;
  }

  set rn(value: string) {
    this._rn = value;
  }
}
