package com.manager.master.dto;

import com.manager.master.entity.GtdLabelEntity;
import com.manager.master.entity.GtdUserEntity;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 群组
 * create  zy
 */
public class GroupOutDto{
    private int groupId;
    private String groupName;
    private String groupHeadImg;
    private int groupCreateId;
    private List<LabelDto> groupLabel;
//    private List<GtdUserEntity> gtdGroupMember;
//    private int labelId;
//    private String labelName;
//    private int labelType;
//    private int userId;
//    private String userName;
//    private String userContact;

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

    public List<LabelDto> getGroupLabel() {
        return groupLabel;
    }

    public void setGroupLabel(List<LabelDto> groupLabel) {
        this.groupLabel = groupLabel;
    }

//    public List<GtdUserEntity> getGtdGroupMember() {
//        return gtdGroupMember;
//    }
//
//    public void setGtdGroupMember(List<GtdUserEntity> gtdGroupMember) {
//        this.gtdGroupMember = gtdGroupMember;
//    }

}
