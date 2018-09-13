/**
 * 提醒时间类
 *
 * create by wzy on 2018//09/13
 */
export class RemindModel {
  private _remindId: number;   // 提醒时间ID
  private _remindDate: string;  // 提醒时间日期

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
}
