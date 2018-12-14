
/**
 * MQ接收业务数据类
 *
 * create by wzy on 2018/11/28
 */
export class WsResModel {
  private _data: WsResDataModel;

  get data(): WsResDataModel {
    return this._data;
  }
  set data(value: WsResDataModel) {
    this._data = value;
  }
}

export class WsResDataModel {
  private _sn: string;      //scheduleName;
  private _st: string;      //startTime;
  private _et: string;      //endTime;
  private _lb: string;      //label;
  private _pn: string;      //planName;
  private _pln: string;     //playerName;
  private _ss: string;      //status;

  private _si: string;      //scheduleId;
  private _ei: string;       //executeId
  private _pli: string;     //playerId;
  private _sa: number;       //scheduleAuth

  private _us: string;      //userId
  private _un: string;      //userName
  private _hi: string;      //headImg
  private _mb: string;      //mobile
  private _ia: string;      //isAgree

  //扩展字段
  private _common_A: string;        //人名原参数value
  private _common_B: string;        //人名原参数normValue
  private _common_C: string;        //
  private _common_D: string;        //
  private _common_E: string;
  private _common_F: string;
  private _common_G: string;
  private _common_H: string;
  private _common_J: string;
  private _common_K: string;
  private _common_L: string;
  private _common_M: string;
  private _common_N: string;
  private _common_O: string;
  private _common_P: string;
  private _common_Q: string;
  private _common_R: string;
  private _common_S: string;
  private _common_T: string;
  private _common_U: string;
  private _common_V: string;
  private _common_W: string;
  private _common_X: string;
  private _common_Y: string;
  private _common_Z: string;

  get sn(): string {
    return this._sn;
  }

  set sn(value: string) {
    this._sn = value;
  }

  get st(): string {
    return this._st;
  }

  set st(value: string) {
    this._st = value;
  }

  get et(): string {
    return this._et;
  }

  set et(value: string) {
    this._et = value;
  }

  get lb(): string {
    return this._lb;
  }

  set lb(value: string) {
    this._lb = value;
  }

  get pn(): string {
    return this._pn;
  }

  set pn(value: string) {
    this._pn = value;
  }

  get pln(): string {
    return this._pln;
  }

  set pln(value: string) {
    this._pln = value;
  }

  get ss(): string {
    return this._ss;
  }

  set ss(value: string) {
    this._ss = value;
  }

  get si(): string {
    return this._si;
  }

  set si(value: string) {
    this._si = value;
  }

  get ei(): string {
    return this._ei;
  }

  set ei(value: string) {
    this._ei = value;
  }

  get pli(): string {
    return this._pli;
  }

  set pli(value: string) {
    this._pli = value;
  }

  get sa(): number {
    return this._sa;
  }

  set sa(value: number) {
    this._sa = value;
  }

  get us(): string {
    return this._us;
  }

  set us(value: string) {
    this._us = value;
  }

  get un(): string {
    return this._un;
  }

  set un(value: string) {
    this._un = value;
  }

  get hi(): string {
    return this._hi;
  }

  set hi(value: string) {
    this._hi = value;
  }

  get mb(): string {
    return this._mb;
  }

  set mb(value: string) {
    this._mb = value;
  }

  get ia(): string {
    return this._ia;
  }

  set ia(value: string) {
    this._ia = value;
  }


  get common_A(): string {
    return this._common_A;
  }

  set common_A(value: string) {
    this._common_A = value;
  }

  get common_B(): string {
    return this._common_B;
  }

  set common_B(value: string) {
    this._common_B = value;
  }

  get common_C(): string {
    return this._common_C;
  }

  set common_C(value: string) {
    this._common_C = value;
  }

  get common_D(): string {
    return this._common_D;
  }

  set common_D(value: string) {
    this._common_D = value;
  }

  get common_E(): string {
    return this._common_E;
  }

  set common_E(value: string) {
    this._common_E = value;
  }

  get common_F(): string {
    return this._common_F;
  }

  set common_F(value: string) {
    this._common_F = value;
  }

  get common_G(): string {
    return this._common_G;
  }

  set common_G(value: string) {
    this._common_G = value;
  }

  get common_H(): string {
    return this._common_H;
  }

  set common_H(value: string) {
    this._common_H = value;
  }

  get common_J(): string {
    return this._common_J;
  }

  set common_J(value: string) {
    this._common_J = value;
  }

  get common_K(): string {
    return this._common_K;
  }

  set common_K(value: string) {
    this._common_K = value;
  }

  get common_L(): string {
    return this._common_L;
  }

  set common_L(value: string) {
    this._common_L = value;
  }

  get common_M(): string {
    return this._common_M;
  }

  set common_M(value: string) {
    this._common_M = value;
  }

  get common_N(): string {
    return this._common_N;
  }

  set common_N(value: string) {
    this._common_N = value;
  }

  get common_O(): string {
    return this._common_O;
  }

  set common_O(value: string) {
    this._common_O = value;
  }

  get common_P(): string {
    return this._common_P;
  }

  set common_P(value: string) {
    this._common_P = value;
  }

  get common_Q(): string {
    return this._common_Q;
  }

  set common_Q(value: string) {
    this._common_Q = value;
  }

  get common_R(): string {
    return this._common_R;
  }

  set common_R(value: string) {
    this._common_R = value;
  }

  get common_S(): string {
    return this._common_S;
  }

  set common_S(value: string) {
    this._common_S = value;
  }

  get common_T(): string {
    return this._common_T;
  }

  set common_T(value: string) {
    this._common_T = value;
  }

  get common_U(): string {
    return this._common_U;
  }

  set common_U(value: string) {
    this._common_U = value;
  }

  get common_V(): string {
    return this._common_V;
  }

  set common_V(value: string) {
    this._common_V = value;
  }

  get common_W(): string {
    return this._common_W;
  }

  set common_W(value: string) {
    this._common_W = value;
  }

  get common_X(): string {
    return this._common_X;
  }

  set common_X(value: string) {
    this._common_X = value;
  }

  get common_Y(): string {
    return this._common_Y;
  }

  set common_Y(value: string) {
    this._common_Y = value;
  }

  get common_Z(): string {
    return this._common_Z;
  }

  set common_Z(value: string) {
    this._common_Z = value;
  }
}
