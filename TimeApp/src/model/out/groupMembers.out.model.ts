/**
 * 群成员类
 *
 * create by hwc on 2018/09/07
 */

export class groupMembers {

  private _userName:string;

  private _userContact:string;


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
