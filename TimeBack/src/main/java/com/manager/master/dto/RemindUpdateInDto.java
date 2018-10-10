package com.manager.master.dto;

/**
 * 提醒时间更新
 */
public class RemindUpdateInDto {
    private Integer userId;     // 用户id
    private String remindDate;  // 提醒时间 ： yyyy-MM-dd HH:mm
    private Integer remindType; // 提醒类型 ：2为用户自定义
    private Integer remindId;   // 提醒时间id

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

    public Integer getRemindType() {
        return remindType;
    }

    public void setRemindType(Integer remindType) {
        this.remindType = remindType;
    }

    public Integer getRemindId() {
        return remindId;
    }

    public void setRemindId(Integer remindId) {
        this.remindId = remindId;
    }

    @Override
    public String toString() {
        return "RemindUpdateInDto{" +
                "userId=" + userId +
                ", remindDate='" + remindDate + '\'' +
                ", remindType=" + remindType +
                ", remindId=" + remindId +
                '}';
    }
}
