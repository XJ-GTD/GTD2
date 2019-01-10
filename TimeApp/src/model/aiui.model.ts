import {ScheduleModel} from "./schedule.model";
import {RcModel} from "./rc.model";
import {RuModel} from "./ru.model";

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

  private _tt: string;     //使用人：U1是用户文言，S1是回答文本 S2是回答链接 S3是回答图片
                            //S4是日程：增删查改/单条 S5是日程查询列表 S6是联系人：增删查改/单条 S7是联系人查询列表

  private _sc: RcModel;             //日程单条
  private _scL: Array<RcModel>;    //日程数据list

  private _pl: RuModel;             //联系人单条
  private _plL: Array<RuModel>;     //联系人数据list

  get pl(): RuModel {
    return this._pl;
  }

  set pl(value: RuModel) {
    this._pl = value;
  }

  get plL(): Array<RuModel> {
    return this._plL;
  }

  set plL(value: Array<RuModel>) {
    this._plL = value;
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

  get ut(): string {
    return this._ut;
  }

  set ut(value: string) {
    this._ut = value;
  }

  get tt(): string {
    return this._tt;
  }

  set tt(value: string) {
    this._tt = value;
  }

  get scL(): Array<RcModel> {
    return this._scL;
  }

  set scL(value: Array<RcModel>) {
    this._scL = value;
  }

  get sc(): RcModel {
    return this._sc;
  }

  set sc(value: RcModel) {
    this._sc = value;
  }
}
