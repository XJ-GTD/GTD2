
/**
 * 日历类
 *
 * create by wzy on 2018/09/16
 */
export class TimeModel {

  constructor() {
    this._date = [];
  }

  private _date: Array<DateModel>;    //  日期

  get date(): Array<DateModel> {
    return this._date;
  }

  set date(value: Array<DateModel>) {
    this._date = value;
  }

}

export class DateModel {

  private _year: number;
  private _month: number;
  private _day: number;

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

  get day(): number {
    return this._day;
  }

  set day(value: number) {
    this._day = value;
  }
}
