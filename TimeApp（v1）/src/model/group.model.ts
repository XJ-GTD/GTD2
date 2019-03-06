/**
 * create by wzy on 2018/05/28
 */
import {LabelModel} from "./label.model";
import {GroupMemberModel} from "./group-member.model";

//参与人类
export class GroupModel {

  private _userId: string;
  private _groupId: string;//群组ID
  private _groupName: string;//群组名
  private _labelList: Array<LabelModel>;//标签
  private _labelName: Array<String>;//标签名称
  private _labelIds: Array<number>;//标签ID
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

  get labelIds(): Array<number> {
    return this._labelIds;
  }

  set labelIds(value: Array<number>) {
    this._labelIds = value;
  }

  get labelName(): Array<String> {
    return this._labelName;
  }

  set labelName(value: Array<String>) {
    this._labelName = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }
}
