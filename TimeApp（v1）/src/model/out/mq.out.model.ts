/**
 * 推送消息BODY
 *
 * create bu wzy on 2018/09/17
 */
export class MqOutModel {

  private _messageName: string;     //新消息主题： schedule Name日程主题 / groupName  群族名
  private _messageId: number;      //新消息ID： scheduleId / groupId
  private _messageContent: string;      //新消息内容： 告知用户邀请详详情
  private _userName: string;        //发布人名称
  private _type: number;       //新消息类型： 1 日程  /  2 群组

  get type(): number {
    return this._type;
  }

  set type(value: number) {
    this._type = value;
  }
  get userName(): string {
    return this._userName;
  }

  set userName(value: string) {
    this._userName = value;
  }
  get messageContent(): string {
    return this._messageContent;
  }

  set messageContent(value: string) {
    this._messageContent = value;
  }
  get messageId(): number {
    return this._messageId;
  }

  set messageId(value: number) {
    this._messageId = value;
  }
  get messageName(): string {
    return this._messageName;
  }

  set messageName(value: string) {
    this._messageName = value;
  }


}
