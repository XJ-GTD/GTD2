/**
 * 群成员类
 * create by wzy on 2018/09/08
 */
export class GroupMemberModel {

  private _userId:number;//群成员Id
  private _userName:string;//群成员名字
  private _userContact:string;//群成员联系方式


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
