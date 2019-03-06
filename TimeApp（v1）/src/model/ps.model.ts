/**
 * create by on 2018/11/19
 */

//参与人
export class PsModel{
  key为accountMobile和userId
  private _accountMobile: string=null;   //联系人电话
  private _userId:string=null; //联系人ID


  get accountMobile(): string {
    return this._accountMobile;
  }

  set accountMobile(value: string) {
    this._accountMobile = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

}
