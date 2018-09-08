/**
 * create by wzy on 2018/05/28
 */

//群组类
export class GroupModel {

  private _groupId: string;//群组ID
  private _roleName: string;//角色名 对应ID：1群主 2成员 3发布人 4执行人
  private _groupName: string;//群组名
  private _groupHeadImg: string;//群组头像
  private _groupMaster: string;//群主
  private _groupMasterId: string;//群主ID
  private _issuerName: string;//发布人姓名 [最新一条]
  private _scheduleName: string;//事件名 [最新一条]
  private _scheduleCreateDate: any;//事件创建时间 [最新一条]

  get groupId(): string {
    return this._groupId;
  }

  set groupId(value: string) {
    this._groupId = value;
  }

  get roleName(): string {
    return this._roleName;
  }

  set roleName(value: string) {
    this._roleName = value;
  }

  get groupName(): string {
    return this._groupName;
  }

  set groupName(value: string) {
    this._groupName = value;
  }

  get groupHeadImg(): string {
    return this._groupHeadImg;
  }

  set groupHeadImg(value: string) {
    this._groupHeadImg = value;
  }

  get groupMaster(): string {
    return this._groupMaster;
  }

  set groupMaster(value: string) {
    this._groupMaster = value;
  }

  get groupMasterId(): string {
    return this._groupMasterId;
  }

  set groupMasterId(value: string) {
    this._groupMasterId = value;
  }

  get issuerName(): string {
    return this._issuerName;
  }

  set issuerName(value: string) {
    this._issuerName = value;
  }

  get scheduleName(): string {
    return this._scheduleName;
  }

  set scheduleName(value: string) {
    this._scheduleName = value;
  }

  get scheduleCreateDate(): any {
    return this._scheduleCreateDate;
  }

  set scheduleCreateDate(value: any) {
    this._scheduleCreateDate = value;
  }

}
