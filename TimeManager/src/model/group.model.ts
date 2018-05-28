/**
 * create by wzy on 2018/05/28
 */
import {baseModel} from "./base.model";

//群组类
export class Group extends baseModel {
  groupId: string;//群组ID
  roleName: string;//角色ID 1群主 2成员 3发布人 4执行人
  groupName: string;//群组名
  groupHeadImg: string;//群组头像
  scheduleName: string;//事件名
  scheduleCreateDate: any;//事件创建时间
}
