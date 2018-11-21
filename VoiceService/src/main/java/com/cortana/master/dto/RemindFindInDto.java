package com.xiaoji.master.dto;

/**
 * 提醒时间查询
 */
public class RemindFindInDto {
    private Integer userId;     // 用户ID
    private Integer scheduleId; // 日程时间ID

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    @Override
    public String toString() {
        return "RemindFindInDto{" +
                "userId=" + userId +
                ", scheduleId=" + scheduleId +
                '}';
    }
}
