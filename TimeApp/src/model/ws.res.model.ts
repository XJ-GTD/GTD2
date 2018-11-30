
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
}
