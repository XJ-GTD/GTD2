/**
 * 群组类
 *
 * create by wzy on 2018/05/28
 */
export class Group {

  private _groupId: string;//群组ID
  private _groupName: string;//群组名
  private _groupHeadImg: string;//群组头像


  get groupName(): string {
    return this._groupName;
  }

  set groupName(value: string) {
    this._groupName = value;
  }
  get groupId(): string {
    return this._groupId;
  }

  set groupId(value: string) {
    this._groupId = value;
  }
  get groupHeadImg(): string {
    return this._groupHeadImg;
  }

  set groupHeadImg(value: string) {
    this._groupHeadImg = value;
  }

}
