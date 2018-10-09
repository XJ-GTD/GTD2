package com.manager.master.dto;

/**
 *  提醒时间删除
 */
public class RemindDeleteInDto {
    private Integer userId;     // 用户id
    private Integer remindId;   // 提醒时间id

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getRemindId() {
        return remindId;
    }

    public void setRemindId(Integer remindId) {
        this.remindId = remindId;
    }

    @Override
    public String toString() {
        return "RemindDeleteInDto{" +
                "userId=" + userId +
                ", remindId=" + remindId +
                '}';
    }
}
