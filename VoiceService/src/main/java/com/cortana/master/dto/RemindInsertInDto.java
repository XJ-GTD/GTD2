package com.xiaoji.master.dto;

/**
 * 提醒时间入库设置
 */
public class RemindInsertInDto {
    private Integer userId;         // 用户ID
    private String remindDate;      // 提醒时间  yyyy-MM-dd HH:mm
    private Integer scheduleId;     // 日程ID
    private Integer remindType;     // 提醒类型 2-用户自定义

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getRemindDate() {
        return remindDate;
    }

    public void setRemindDate(String remindDate) {
        this.remindDate = remindDate;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Integer getRemindType() {
        return remindType;
    }

    public void setRemindType(Integer remindType) {
        this.remindType = remindType;
    }

    @Override
    public String toString() {
        return "RemindInsertInDto{" +
                "userId=" + userId +
                ", remindDate='" + remindDate + '\'' +
                ", scheduleId=" + scheduleId +
                ", remindType=" + remindType +
                '}';
    }
}
