import {GroupModel} from "./group.model";
import {RemindModel} from "./remind.model";

/**
 * 日程类
 *
 * create by wzy on 2018/05/28
 */
export class ScheduleModel {

  private _code: number;                              //消息状态值
  private _scheduleId: string;                        // 日程事件ID
  private _scheduleName: string;                    // 日程事件名称
  private _scheduleStartTime: string;              // 开始时间
  private _scheduleDeadline: string;               // 截止时间
  private _scheduleStatus: string;                 // 完成状态
  private _scheduleFinishDate: string;              // 完成时间
  private _labelName: string;               //标签名称
  private _labelColor: string;               //标签颜色
  private _scheduleType:string;             //日程类型
  private _isMessage:boolean = false; //是否新消息
  private _group: Array<GroupModel>;                 //参与人
  private _remind: Array<RemindModel>;              //提醒时间

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

  get scheduleId(): string {
    return this._scheduleId;
  }
  set scheduleId(value: string) {
    this._scheduleId = value;
  }

  get code(): number {
    return this._code;
  }

  set code(value: number) {
    this._code = value;
  }

  get remind(): Array<RemindModel> {
    return this._remind;
  }

  set remind(value: Array<RemindModel>) {
    this._remind = value;
  }
  get group(): Array<GroupModel> {
    return this._group;
  }

  set group(value: Array<GroupModel>) {
    this._group = value;
  }
  get labelName(): string {
    return this._labelName;
  }

  set labelName(value: string) {
    this._labelName = value;
  }
  get scheduleFinishDate(): string {
    return this._scheduleFinishDate;
  }

  set scheduleFinishDate(value: string) {
    this._scheduleFinishDate = value;
  }

  get labelColor(): string {
    return this._labelColor;
  }

  set labelColor(value: string) {
    this._labelColor = value;
  }

  get scheduleType(): string {
    return this._scheduleType;
  }

  set scheduleType(value: string) {
    this._scheduleType = value;
  }

  get isMessage(): boolean {
    return this._isMessage;
  }

  set isMessage(value: boolean) {
    this._isMessage = value;
  }
}
