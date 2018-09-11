/**
 * 参与人列表查询类
 *
 * create by wzy on 2018/09/06
 */
export class FindOutModel {

  private _userId: number;    //用户ID
  private _findType: number;  //查询类型
  private _groupId: number;    //群组ID

  get findType(): number {
    return this._findType;
  }

  set findType(value: number) {
    this._findType = value;
  }
  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  get groupId(): number {
    return this._groupId;
  }

  set groupId(value: number) {
    this._groupId = value;
  }

}
