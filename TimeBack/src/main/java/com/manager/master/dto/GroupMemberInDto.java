package com.manager.master.dto;

import java.util.List;

public class GroupMemberInDto {
    private int userId;                     //用户ID
    private int groupId;                    //群组ID
    private String labelName;               //标签名
    private String groupName;               //群组名
    private String groupHeadImgUrl;        //群头像
    private String condition;
    private List<Integer> labelId;          //标签ID List
    private List<GroupMemberOutDto> member; //群成员 List


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

    public String getLabelName() {
        return labelName;
    }

    public void setLabelName(String labelName) {
        this.labelName = labelName;
    }

    public String getGroupHeadImgUrl() {
        return groupHeadImgUrl;
    }

    public void setGroupHeadImgUrl(String groupHeadImgUrl) {
        this.groupHeadImgUrl = groupHeadImgUrl;
    }

    public List<Integer> getLabelId() {
        return labelId;
    }

    public void setLabelId(List<Integer> labelId) {
        this.labelId = labelId;
    }

    public List<GroupMemberOutDto> getMember() {
        return member;
    }

    public void setMember(List<GroupMemberOutDto> member) {
        this.member = member;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }
}
