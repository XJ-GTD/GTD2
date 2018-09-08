/**
 * 群成员类
 *
 * create by hwc on 2018/09/07
 */

export class groupMembers {

  private _userId:number;//用户Id
  private _userName:string;//用户名字
  private _userContact:string;//联系方式


  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  get userName(): string {
    return this._userName;
  }

  set userName(value: string) {
    this._userName = value;
  }

  get userContact(): string {
    return this._userContact;
  }

  set userContact(value: string) {
    this._userContact = value;
  }
}
