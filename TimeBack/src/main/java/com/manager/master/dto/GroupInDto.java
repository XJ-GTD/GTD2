package com.manager.master.dto;

import com.manager.master.entity.GtdLabelEntity;

import java.util.Date;
import java.util.List;
import java.util.Set;

public class GroupInDto {
    private int userId;
    private int groupId;
    private String labelName;
    private String groupName;
    private String groupHeadimgUrl;
    private List<Integer> labelId;
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

    public String getGroupHeadimgUrl() {
        return groupHeadimgUrl;
    }

    public void setGroupHeadimgUrl(String groupHeadimgUrl) {
        this.groupHeadimgUrl = groupHeadimgUrl;
    }

    public List<Integer> getLabelId() {
        return labelId;
    }

    public void setLabelId(List<Integer> labelId) {
        this.labelId = labelId;
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

}
