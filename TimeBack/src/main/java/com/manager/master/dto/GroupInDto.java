package com.manager.master.dto;

import com.manager.master.entity.GtdLabelEntity;

import java.util.Date;
import java.util.List;
import java.util.Set;

public class GroupInDto {
    private int userId;
    private int groupId;
    private String message;
    private String labelName;
    private String groupName;
    private String groupHeadImgUrl;
    private String condition;
    private Integer labelId;
    private List<Integer> labelIds;
    private List<GroupMemberDto> member;


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

    public List<Integer> getLabelIds() {
        return labelIds;
    }

    public void setLabelIds(List<Integer> labelIds) {
        this.labelIds = labelIds;
    }

    public List<GroupMemberDto> getMember() {
        return member;
    }

    public void setMember(List<GroupMemberDto> member) {
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getLabelId() {
        return labelId;
    }

    public void setLabelId(Integer labelId) {
        this.labelId = labelId;
    }
}
