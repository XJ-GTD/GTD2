/**
 * create by wzy on 2018/05/28
 */

//用户类
export class UserModel {

  private _accountId: number;    //账户ID
  private _userId: number;   //用户ID
  private _accountUuid: string;
  private _headimgUrl: string;          //头像URL
  private _accountQq: string;           //账户QQ
  private _accountWechat: string;       //账户微信
  private _accountName: string;         //账户名
  private _accountMobile: string;    //手机号
  private _userName: string;   //昵称
  private _accountQueue: string;    //消息队列

  get accountId(): number {
    return this._accountId;
  }

  set accountId(value: number) {
    this._accountId = value;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  get accountUuid(): string {
    return this._accountUuid;
  }

  set accountUuid(value: string) {
    this._accountUuid = value;
  }

  get headimgUrl(): string {
    return this._headimgUrl;
  }

  set headimgUrl(value: string) {
    this._headimgUrl = value;
  }

  get accountQq(): string {
    return this._accountQq;
  }

  set accountQq(value: string) {
    this._accountQq = value;
  }

  get accountWechat(): string {
    return this._accountWechat;
  }

  set accountWechat(value: string) {
    this._accountWechat = value;
  }

  get accountName(): string {
    return this._accountName;
  }

  set accountName(value: string) {
    this._accountName = value;
  }

  get accountMobile(): string {
    return this._accountMobile;
  }

  set accountMobile(value: string) {
    this._accountMobile = value;
  }

  get userName(): string {
    return this._userName;
  }

  set userName(value: string) {
    this._userName = value;
  }

  get accountQueue(): string {
    return this._accountQueue;
  }

  set accountQueue(value: string) {
    this._accountQueue = value;
  }

}
