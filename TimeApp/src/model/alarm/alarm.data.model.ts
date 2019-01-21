
/**
 * 闹钟详情数据类
 *
 * create by wzy on 2019/01/21
 */
export class AlarmDataModel {

  private type : string;    //类型 snooze  onetime
  private time : AlarmTimeModel;  // 时间json：onetime year：*，month：*， day：*， hour：*， minutes：*， second：* | snooze for 60 seconds
  private extra : { };      // json containing app-specific information to be posted when alarm triggers
  // message : this.get('message'),
  // sound : this.get('sound'),
  // action : this.get('action')


}

export class AlarmTimeModel {

  private _year: string;   //yyyy
  private _month:string;   //mm
  private _day: string;    //dd
  private _hour: string;   //hh
  private _minute: string; //mm
  private _second: string; //ss


  constructor(year: string, month: string, day: string, hour: string, minute: string, second: string) {
    this._year = year;
    this._month = month;
    this._day = day;
    this._hour = hour;
    this._minute = minute;
    this._second = second;
  }

  get year(): string {
    return this._year;
  }

  set year(value: string) {
    this._year = value;
  }

  get month(): string {
    return this._month;
  }

  set month(value: string) {
    this._month = value;
  }

  get day(): string {
    return this._day;
  }

  set day(value: string) {
    this._day = value;
  }

  get hour(): string {
    return this._hour;
  }

  set hour(value: string) {
    this._hour = value;
  }

  get minute(): string {
    return this._minute;
  }

  set minute(value: string) {
    this._minute = value;
  }

  get second(): string {
    return this._second;
  }

  set second(value: string) {
    this._second = value;
  }
}
