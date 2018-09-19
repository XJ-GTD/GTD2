import {ScheduleModel} from "./schedule.model";

/**
 * 讯飞语音消息回传类
 *
 * create by wzy on 2018/09/17
 */
export class AiuiModel {

  private _code: number;                       //动作判断flag
  private _userNameList: Array<string>;		//参与人
  private _scheduleName: string;						//日程主题
  private _scheduleStartTime: string;					//开始时间
  private _scheduleDeadline: string;					//结束时间
  private _speech: string;      //讯飞语音播报字段
  private _userText: string;      //用户语音播报字段

  private _dataType: string;       //数据类型 0：无数据对话 1：单个详情  2：列表list
  private _talkType: number;     //使用人：1是用户，2是讯飞

  private _scheduleCreateList: Array<ScheduleModel>;       // 查询自己创建的日程
  private _scheduleJoinList: Array<ScheduleModel>;      // 查询自己参与的日程

  get code(): number {
    return this._code;
  }

  set code(value: number) {
    this._code = value;
  }

  get userNameList(): Array<string> {
    return this._userNameList;
  }
  get talkType(): number {
    return this._talkType;
  }

  set talkType(value: number) {
    this._talkType = value;
  }

  set userNameList(value: Array<string>) {
    this._userNameList = value;
  }

  get scheduleName(): string {
    return this._scheduleName;
  }

  set scheduleName(value: string) {
    this._scheduleName = value;
  }

  get scheduleStartTime(): string {
    return this._scheduleStartTime;
  }

  set scheduleStartTime(value: string) {
    this._scheduleStartTime = value;
  }

  get scheduleDeadline(): string {
    return this._scheduleDeadline;
  }

  set scheduleDeadline(value: string) {
    this._scheduleDeadline = value;
  }

  get speech(): string {
    return this._speech;
  }

  set speech(value: string) {
    this._speech = value;
  }

  get userText(): string {
    return this._userText;
  }

  set userText(value: string) {
    this._userText = value;
  }

  get dataType(): string {
    return this._dataType;
  }

  set dataType(value: string) {
    this._dataType = value;
  }

  get scheduleCreateList(): Array<ScheduleModel> {
    return this._scheduleCreateList;
  }

  set scheduleCreateList(value: Array<ScheduleModel>) {
    this._scheduleCreateList = value;
  }

  get scheduleJoinList(): Array<ScheduleModel> {
    return this._scheduleJoinList;
  }

  set scheduleJoinList(value: Array<ScheduleModel>) {
    this._scheduleJoinList = value;
  }

}
