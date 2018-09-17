package com.manager.master.dto;

import java.util.List;

/**
 * 群组
 * create  zy
 */
public class GroupOutDto{
    private int groupId;                         //群组ID
    private String groupName;                    //群组名
    private String groupHeadImg;                 //群头像
    private int groupCreateId;                  //群创建人
    private List<LabelOutDto> labelList;         //群标签 List
    private List<GroupMemberDto> groupMembers;   //群成员 List

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupHeadImg() {
        return groupHeadImg;
    }

    public void setGroupHeadImg(String groupHeadImg) {
        this.groupHeadImg = groupHeadImg;
    }

    public int getGroupCreateId() {
        return groupCreateId;
    }

    public void setGroupCreateId(int groupCreateId) {
        this.groupCreateId = groupCreateId;
    }

    public List<LabelOutDto> getLabelList() {
        return labelList;
    }

    public void setLabelList(List<LabelOutDto> labelList) {
        this.labelList = labelList;
    }

    public List<GroupMemberDto> getGroupMembers() {
        return groupMembers;
    }

    public void setGroupMembers(List<GroupMemberDto> groupMembers) {
        this.groupMembers = groupMembers;
    }
}
