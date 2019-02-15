import {GroupModel} from "./group.model";
import {RemindModel} from "./remind.model";
import {RuModel} from "./ru.model";
import {BsModel} from "./out/bs.model";

/**
 * 日程类
 *
 * create by wzy on 2018/05/28
 */
export class ScheduleDetailsModel extends BsModel{

  private _scheduleId: string;                        // 日程事件ID
  private _scheduleName: string;                    // 日程事件名称
  private _scheduleStartTime: string;              // 开始时间
  private _scheduleStartDate: string;              // 开始日期
  private _scheduleDeadline: string;               // 截止时间
  private _scheduleStatus: string;                 // 完成状态
  private _scheduleFinishDate: string;              // 完成时间
  private _labelName: string;               //标签名称
  private _labelColor: string;               //标签颜色
  private _scheduleType:string;             //日程类型1自己;2他人推送
  private _planId:string;             //计划ID
  private _planName:string;             //计划名称
  private _isMessage:boolean = false; //是否新消息
  private _group: Array<RuModel>;      //参与人
  private _comment:string; //备注
  private _repeatType:string; //重复类型
  private _remindTime :string; //提醒方式
  private _publisherName :string; //发布人姓名
  private _publisherInfo: RuModel;      //参与人信息
  private _modifyAuth: string; // 修改状态0不可修改，1可修改



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

  get planId(): string {
    return this._planId;
  }

  set planId(value: string) {
    this._planId = value;
  }

  get planName(): string {
    return this._planName;
  }

  set planName(value: string) {
    this._planName = value;
  }

  get comment(): string {
    return this._comment;
  }

  set comment(value: string) {
    this._comment = value;
  }

  get repeatType(): string {
    return this._repeatType;
  }

  set repeatType(value: string) {
    this._repeatType = value;
  }

  get remindTime(): string {
    return this._remindTime;
  }

  set remindTime(value: string) {
    this._remindTime = value;
  }

  get group(): Array<RuModel> {
    return this._group;
  }

  set group(value: Array<RuModel>) {
    this._group = value;
  }

  get publisherName(): string {
    return this._publisherName;
  }

  set publisherName(value: string) {
    this._publisherName = value;
  }

  get publisherInfo(): RuModel {
    return this._publisherInfo;
  }

  set publisherInfo(value: RuModel) {
    this._publisherInfo = value;
  }

  get modifyAuth(): string {
    return this._modifyAuth;
  }

  set modifyAuth(value: string) {
    this._modifyAuth = value;
  }

  get scheduleStartDate(): string {
    return this._scheduleStartDate;
  }

  set scheduleStartDate(value: string) {
    this._scheduleStartDate = value;
  }
}
