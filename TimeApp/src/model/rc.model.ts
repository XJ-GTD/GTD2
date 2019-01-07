/**
 * create by on 2018/11/19
 */
import {BsModel} from "./out/bs.model";
import {RguModel} from "./rgu.model";
import {RuModel} from "./ru.model";

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
  private _sa:string = null; //修改权限 0不可修改，1可修改
  private _pI: string=null;//日程参与人表uuID
  private _rus : Array<RuModel> //联系人
  private _cft:string=null; //重复类型
  private _ac:string=null; //提醒方式
  private _fh:string=null; //完成情况
  private _noca:string;
  private _nocb:string;
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

  get sa(): string {
    return this._sa;
  }

  set sa(value: string) {
    this._sa = value;
  }

  get pI(): string {
    return this._pI;
  }

  set pI(value: string) {
    this._pI = value;
  }

  get rus(): Array<RuModel> {
    return this._rus;
  }

  set rus(value: Array<RuModel>) {
    this._rus = value;
  }

  get noca(): string {
    return this._noca;
  }

  set noca(value: string) {
    this._noca = value;
  }

  get nocb(): string {
    return this._nocb;
  }

  set nocb(value: string) {
    this._nocb = value;
  }

  get cft(): string {
    return this._cft;
  }

  set cft(value: string) {
    this._cft = value;
  }

  get ac(): string {
    return this._ac;
  }

  set ac(value: string) {
    this._ac = value;
  }

  get fh(): string {
    return this._fh;
  }

  set fh(value: string) {
    this._fh = value;
  }
}
