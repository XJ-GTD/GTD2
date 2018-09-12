package com.manager.master.dto;

/**
 * 提醒时间列表 - 出参 (部分)
 * @author myx
 * @since 2018/09/11
 */
public class RemindOutDto {
    private Integer remindId;   // 提醒时间ID
    private String remindDate;  // 提醒时间日期

    public Integer getRemindId() {
        return remindId;
    }

    public void setRemindId(Integer remindId) {
        this.remindId = remindId;
    }

    public String getRemindDate() {
        return remindDate;
    }

    public void setRemindDate(String remindDate) {
        this.remindDate = remindDate;
    }

    @Override
    public String toString() {
        return "RemindOutDto{" +
                "remindId=" + remindId +
                ", remindDate='" + remindDate + '\'' +
                '}';
    }
}
