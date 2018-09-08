/**
 * 查询全部群组数据
 *
 * create by hwc on 2018/09/07
 */
import {groupLabel} from "./groupLabel.out.model";
import {groupMembers} from "./groupMembers.out.model";

export class groupList {

  private _groupId: number;//群组Id
  private _groupName: string;//群组名称
  private _groupHeadImg: string;//群组头像
  private _groupCreateId: number;//创建人Id
  private _groupLabel:Array<groupLabel>;//标签[list]
  private _gtdGroupMember:Array<groupMembers>;//群成员[list]

  get groupId(): number {
    return this._groupId;
  }

  set groupId(value: number) {
    this._groupId = value;
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

  get groupCreateId(): number {
    return this._groupCreateId;
  }

  set groupCreateId(value: number) {
    this._groupCreateId = value;
  }

  get groupLabel(): any {
    return this._groupLabel;
  }

  set groupLabel(value: any) {
    this._groupLabel = value;
  }

  get gtdGroupMember(): any {
    return this._gtdGroupMember;
  }

  set gtdGroupMember(value: any) {
    this._gtdGroupMember = value;
  }
}
