
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

  private _isToday: boolean;
  private _isActivity: boolean;
  private _isMonth: boolean;

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

  get isMonth(): boolean {
    return this._isMonth;
  }

  set isMonth(value: boolean) {
    this._isMonth = value;
  }
  get isActivity(): boolean {
    return this._isActivity;
  }

  set isActivity(value: boolean) {
    this._isActivity = value;
  }
  get isToday(): boolean {
    return this._isToday;
  }

  set isToday(value: boolean) {
    this._isToday = value;
  }
}
