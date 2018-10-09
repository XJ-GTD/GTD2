package com.manager.master.dto;

import com.manager.master.entity.GtdLabelEntity;

import java.util.Date;
import java.util.List;
import java.util.Set;

public class GroupInDto {
    private int userId;                        //用户ID
    private int groupId;                       //群组ID
    private String labelName;                  //标签名
    private String groupName;                  //参与人名
    private String groupHeadImgUrl;           //群头像
    private String condition;
    private Integer labelId;                    //标签ID
    private List<Integer> labelIds;             //标签ID List
    private List<GroupMemberDto> groupMember;        //群成员 List


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
        return groupMember;
    }

    public void setMember(List<GroupMemberDto> groupMember) {
        this.groupMember = groupMember;
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

    public Integer getLabelId() {
        return labelId;
    }

    public void setLabelId(Integer labelId) {
        this.labelId = labelId;
    }
}
