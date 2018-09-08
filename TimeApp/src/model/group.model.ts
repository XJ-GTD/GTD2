/**
 * create by wzy on 2018/05/28
 */
import {LabelModel} from "./label.model";
import {GroupMemberModel} from "./groupMember.model";

//参与人类
export class GroupModel {

  private _groupId: string;//群组ID
  private _groupName: string;//群组名
  private _labelList: Array<LabelModel>;//标签
  private _groupHeadImg: string;//群头像
  private _groupCreateId: number;//群创建人
  private _groupMembers: Array<GroupMemberModel>;//群成员

  get groupId(): string {
    return this._groupId;
  }

  set groupId(value: string) {
    this._groupId = value;
  }

  get groupName(): string {
    return this._groupName;
  }

  set groupName(value: string) {
    this._groupName = value;
  }

  get labelList(): Array<LabelModel> {
    return this._labelList;
  }

  set labelList(value: Array<LabelModel>) {
    this._labelList = value;
  }

  get groupHeadImg(): string {
    return this._groupHeadImg;
  }

  set groupHeadImg(value: string) {
    this._groupHeadImg = value;
  }

  get groupCreateId(): number {
    return this._groupCreateId;
  }

  set groupCreateId(value: number) {
    this._groupCreateId = value;
  }

  get groupMembers(): Array<GroupMemberModel> {
    return this._groupMembers;
  }

  set groupMembers(value: Array<GroupMemberModel>) {
    this._groupMembers = value;
  }
}
