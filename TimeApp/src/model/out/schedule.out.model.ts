/**
 * 日程请求服务类
 *
 * create by wzy on 2018/09/06
 */
export class ScheduleOutModel {

  private _userId: number;            //用户ID
  private _scheduleName: string;      //日程主题
  private _scheduleStartTime: string;   //开始时间
  private _scheduleDeadline: string;    //截止时间
  private _labelIds: Array<number>;   //标签ID List
  private _groupIds: Array<number>;   //参与人ID List
  private s

  get groupIds(): Array<number> {
    return this._groupIds;
  }

  set groupIds(value: Array<number>) {
    this._groupIds = value;
  }
  get labelIds(): Array<number> {
    return this._labelIds;
  }

  set labelIds(value: Array<number>) {
    this._labelIds = value;
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
  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }


}
