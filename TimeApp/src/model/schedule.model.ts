/**
 * 日程类
 *
 * create by wzy on 2018/05/28
 */
export class ScheduleModel {

  private _code: number;                              //消息状态值
  private _scheduleId: number;                        // 日程事件ID
  private _scheduleName: string;                    // 日程事件名称
  private _scheduleStartTime: string;              // 开始时间
  private _scheduleDeadline: string;               // 截止时间
  private _scheduleStatus: string;                 // 完成状态

  get scheduleStatus(): string {
    return this._scheduleStatus;
  }
  set scheduleStatus(value: string) {
    this._scheduleStatus = value;
  }

  get scheduleDeadline(): string {
    return this._scheduleDeadline;
  }
  set scheduleDeadline(value: string) {
    this._scheduleDeadline = value;
  }

  get scheduleStartTime(): string {
    return this._scheduleStartTime;
  }
  set scheduleStartTime(value: string) {
    this._scheduleStartTime = value;
  }

  get scheduleName(): string {
    return this._scheduleName;
  }
  set scheduleName(value: string) {
    this._scheduleName = value;
  }

  get scheduleId(): number {
    return this._scheduleId;
  }
  set scheduleId(value: number) {
    this._scheduleId = value;
  }

  get code(): number {
    return this._code;
  }

  set code(value: number) {
    this._code = value;
  }
}
