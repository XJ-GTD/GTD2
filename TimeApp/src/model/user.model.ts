/**
 * create by wzy on 2018/05/28
 */

//用户类
export class UserModel {

  private _userId: string;   //用户ID
  private _userName: string;   //昵称
  private _headImgUrl: string;          //头像URL
  private _birthday: string;    // 生日
  private _userSex: number;     // 性别
  private _userContact: string; // 联系方式
  private _accountName: string;         //账户名
  private _accountQq: string;           //账户QQ
  private _accountWechat: string;       //账户微信
  private _accountMobile: string;    //手机号
  private _accountQueue: string;    //消息队列
  private _accountUuid: string;
  private _userToken:string;

  get userToken(): string {
    return this._userToken;
  }

  set userToken(value: string) {
    this._userToken = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get accountUuid(): string {
    return this._accountUuid;
  }

  set accountUuid(value: string) {
    this._accountUuid = value;
  }

  get headImgUrl(): string {
    return this._headImgUrl;
  }

  set headImgUrl(value: string) {
    this._headImgUrl = value;
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

  get userContact(): string {
    return this._userContact;
  }

  set userContact(value: string) {
    this._userContact = value;
  }

  get birthday(): string {
    return this._birthday;
  }

  set birthday(value: string) {
    this._birthday = value;
  }
  get userSex(): number {
    return this._userSex;
  }

  set userSex(value: number) {
    this._userSex = value;
  }
}
