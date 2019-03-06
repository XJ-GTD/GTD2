import {GroupModel} from "./group.model";
import {RemindModel} from "./remind.model";

/**
 * 当月显示事件标识
 *
 * create by dch on 2018/11/22
 */
export class MbsModel {

  private _date: Date;
  private _im: boolean = false; //是否忙
  private _iem: boolean = false;//是否存在消息
  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

  get im(): boolean {
    return this._im;
  }

  set im(value: boolean) {
    this._im = value;
  }

  get iem(): boolean {
    return this._iem;
  }

  set iem(value: boolean) {
    this._iem = value;
  }
}
