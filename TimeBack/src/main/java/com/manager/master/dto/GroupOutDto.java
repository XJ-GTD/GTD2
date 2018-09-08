package com.manager.master.dto;

import java.util.List;

/**
 * 群组
 * create  zy
 */
public class GroupOutDto{
    private int groupId;
    private String groupName;
    private String groupHeadImg;
    private int groupCreateId;
    private List<LabelOutDto> groupLabel;
    private List<GroupMemberDto> gtdGroupMember;

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

    public List<LabelOutDto> getGroupLabel() {
        return groupLabel;
    }

    public void setGroupLabel(List<LabelOutDto> groupLabel) {
        this.groupLabel = groupLabel;
    }

    public List<GroupMemberDto> getGtdGroupMember() {
        return gtdGroupMember;
    }

    public void setGtdGroupMember(List<GroupMemberDto> gtdGroupMember) {
        this.gtdGroupMember = gtdGroupMember;
    }
}
