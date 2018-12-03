import {ScheduleModel} from "./schedule.model";
import {RcModel} from "./rc.model";

/**
 * 讯飞语音消息回传类
 *
 * create by wzy on 2018/09/17
 */
export class AiuiModel {

  private _at: string;      //answerText;
  private _au: string;      //answerUrl;
  private _ai: string;      //answerImg;
  private _ut: string;      //用户语音播报字段

  private _dt: string;       //数据类型 0：无数据对话 1：单个详情  2：列表list
  private _tt: number;     //使用人：1是用户，2是讯飞

  private _scL: Array<RcModel>;    //日程数据list


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

  get ut(): string {
    return this._ut;
  }

  set ut(value: string) {
    this._ut = value;
  }

  get dt(): string {
    return this._dt;
  }

  set dt(value: string) {
    this._dt = value;
  }

  get tt(): number {
    return this._tt;
  }

  set tt(value: number) {
    this._tt = value;
  }

  get scL(): Array<RcModel> {
    return this._scL;
  }

  set scL(value: Array<RcModel>) {
    this._scL = value;
  }
}
