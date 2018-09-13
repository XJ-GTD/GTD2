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
  private _scheduleStatus: number;   //日程状态 0是完成，1是未完成，2是过期
  private _groupId: number;            //查询群相关事件
  private _scheduleId: number;         //查询单个事件详情
  private _labelId: number;            //查询单个标签相关事件
  private _groupName: string;          //查询参与人相关事件
  private _groupMemberName: string;    //查询参与群组成员相关日程

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

  get scheduleStatus(): number {
    return this._scheduleStatus;
  }

  set scheduleStatus(value: number) {
    this._scheduleStatus = value;
  }

  get groupMemberName(): string {
    return this._groupMemberName;
  }

  set groupMemberName(value: string) {
    this._groupMemberName = value;
  }
  get groupName(): string {
    return this._groupName;
  }

  set groupName(value: string) {
    this._groupName = value;
  }
  get labelId(): number {
    return this._labelId;
  }

  set labelId(value: number) {
    this._labelId = value;
  }
  get scheduleId(): number {
    return this._scheduleId;
  }

  set scheduleId(value: number) {
    this._scheduleId = value;
  }
  get groupId(): number {
    return this._groupId;
  }

  set groupId(value: number) {
    this._groupId = value;
  }

}
