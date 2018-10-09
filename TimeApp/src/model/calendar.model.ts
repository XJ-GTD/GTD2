import {TimeModel} from "./time.model";

/**
 * 日历类
 *
 * create by wzy on 2018/09/27
 */
export class CalendarModel {

  private _year: number;   //年
  private _month: number;    //月
  private _dayList: Array<TimeModel>; //日
  private _weekDay: Array<string> = ["SUN","MON","TUES","WED","THUR","FRI","SAT"];   //周标识

  get weekDay(): Array<string> {
    return this._weekDay;
  }

  set weekDay(value: Array<string>) {
    this._weekDay = value;
  }
  get dayList(): Array<TimeModel> {
    return this._dayList;
  }

  set dayList(value: Array<TimeModel>) {
    this._dayList = value;
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
