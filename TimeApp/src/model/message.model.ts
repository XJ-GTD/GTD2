
/**
 * 新消息反馈类
 *
 * create by wzy on 2018/05/28
 */
export class MessageModel {

  private _userId: number;           //用户ID
  private _scheduleId: number;         //日程ID
  private _playersStatus: number;      //日程接受或拒绝 1接受 -1拒绝
  private _groupId: number;          // 群组ID
  private _resultType: number;         //返回消息类型 1是同意，3是拒絕

  get resultType(): number {
    return this._resultType;
  }

  set resultType(value: number) {
    this._resultType = value;
  }

  get groupId(): number {
    return this._groupId;
  }

  set groupId(value: number) {
    this._groupId = value;
  }
  get playersStatus(): number {
    return this._playersStatus;
  }

  set playersStatus(value: number) {
    this._playersStatus = value;
  }
  get scheduleId(): number {
    return this._scheduleId;
  }

  set scheduleId(value: number) {
    this._scheduleId = value;
  }
  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }


}
