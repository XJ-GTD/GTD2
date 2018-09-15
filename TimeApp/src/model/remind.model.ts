/**
 * 提醒时间类
 *
 * create by wzy on 2018//09/13
 */
export class RemindModel {

  private _remindId: number;   // 提醒时间ID
  private _remindDate: string;  // 提醒时间日期
  private _scheduleName: string; //提醒标题

  get remindId(): number {
    return this._remindId;
  }

  set remindId(value: number) {
    this._remindId = value;
  }

  get remindDate(): string {
    return this._remindDate;
  }

  set remindDate(value: string) {
    this._remindDate = value;
  }

  get scheduleName(): string {
    return this._scheduleName;
  }

  set scheduleName(value: string) {
    this._scheduleName = value;
  }
}
