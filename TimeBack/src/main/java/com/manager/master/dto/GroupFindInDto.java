package com.manager.master.dto;

/**
 * 群组查询入参
 *
 * create by wzy on 2018/09/04
 */
public class GroupFindInDto {

    private int userId;          //用户ID
    private int groupId;        //群组ID
    private int findType;       //查询类型
    private Integer resultType;       //返回消息类型 1是同意，3是拒絕

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

    public Integer getResultType() {
        return resultType;
    }

    public void setResultType(Integer resultType) {
        this.resultType = resultType;
    }
}
