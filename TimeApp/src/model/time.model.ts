
/**
 * 日历类
 *
 * create by wzy on 2018/09/16
 */
export class TimeModel {

  constructor() {
    this._day = [];
  }

  private _year: number;
  private _month: number;
  private _day: Array<string>;    //  日期

  get day(): Array<string> {
    return this._day;
  }

  set day(value: Array<string>) {
    this._day = value;
  }

  get month(): number {
    return this._month;
  }

  set month(value: number) {
    this._month = value;
  }
  get year(): number {
    return this._year;
  }

  set year(value: number) {
    this._year = value;
  }
}
