import {WsSrcModel} from "./ws.src.model";
import {WsResModel} from "./ws.res.model";

/**
 * MQ接收数据类
 *
 * create by wzy on 2018/11/28
 */
export class WsModel {
  private _vs: string;      //version
  private _at: string;      //answerText;
  private _au: string;      //answerUrl;
  private _ai: string;      //answerImg;
  private _ss: number;      //status;
  private _sk: string;      //skillType;
  private _src: WsSrcModel; //source;
  private _res: WsResModel; //result;

  get vs(): string {
    return this._vs;
  }

  set vs(value: string) {
    this._vs = value;
  }

  get at(): string {
    return this._at;
  }

  set at(value: string) {
    this._at = value;
  }

  get au(): string {
    return this._au;
  }

  set au(value: string) {
    this._au = value;
  }

  get ai(): string {
    return this._ai;
  }

  set ai(value: string) {
    this._ai = value;
  }

  get ss(): number {
    return this._ss;
  }

  set ss(value: number) {
    this._ss = value;
  }

  get sk(): string {
    return this._sk;
  }

  set sk(value: string) {
    this._sk = value;
  }

  get src(): WsSrcModel {
    return this._src;
  }

  set src(value: WsSrcModel) {
    this._src = value;
  }

  get res(): WsResModel {
    return this._res;
  }

  set res(value: WsResModel) {
    this._res = value;
  }
}
