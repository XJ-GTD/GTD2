package com.manager.master.dto;

import com.manager.master.entity.GtdLabelEntity;

import java.util.Date;
import java.util.List;
import java.util.Set;

public class GroupInDto {
    private int groupId;
    //private int createId;
    //private List<Integer> userId;
    private List<Integer> labelId;
    private String labelName;
    private String groupName;
    private String userName;
    private String groupHeadimgUrl;
    //private Date createDate;
    //private int updateId;
   // private Date updateDate;

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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
