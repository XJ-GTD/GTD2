package com.manager.master.dto;

import java.util.List;

/**
 * 推送给目标用户类
 *
 * create by wzy on 2018/09/11
 */
public class PushInDto {

    private Integer userId;         //推送人用户ID
    private Integer targetUserId;       //推送目标UserId

    private List<Integer> memberUserId; //参与人ID List

    private PushOutDto data;            //推送数据

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public List<Integer> getMemberUserId() {
        return memberUserId;
    }

    public void setMemberUserId(List<Integer> memberUserId) {
        this.memberUserId = memberUserId;
    }

    public PushOutDto getData() {
        return data;
    }

    public void setData(PushOutDto data) {
        this.data = data;
    }

    public Integer getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(Integer targetUserId) {
        this.targetUserId = targetUserId;
    }
}
