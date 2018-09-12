package com.manager.master.dto;

public class InformInDto {
    private Integer userId;
    private Integer groupId;
    private Integer resultType;       //返回消息类型 1是同意，3是拒絕


    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public Integer getResultType() {
        return resultType;
    }

    public void setResultType(Integer resultType) {
        this.resultType = resultType;
    }
}
