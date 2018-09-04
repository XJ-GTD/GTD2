package com.manager.master.dto;

/**
 * 群组查询入参
 *
 * create by wzy on 2018/09/04
 */
public class GroupFindInDto {

    private int userId;
    private int findType;       //查询类型
    private int groupId;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getFindType() {
        return findType;
    }

    public void setFindType(int findType) {
        this.findType = findType;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }
}
