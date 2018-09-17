package com.manager.master.dto;

import java.sql.Timestamp;
import java.util.List;

/**
 * 日程
 * creaty  zy
 */
public class ScheduleOutDto {
    private Integer scheduleId;                        // 日程事件ID
    private String scheduleName;                    // 日程事件名称
    private Timestamp scheduleStartTime;              // 开始时间
    private Timestamp scheduleDeadline;               // 截止时间
    private Integer scheduleRepeatType;               // 日程重复类型
    private String scheduleStatus;                 // 完成状态

    private Integer createId;      // 发布人ID

    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Timestamp getScheduleStartTime() {
        return scheduleStartTime;
    }

    public void setScheduleStartTime(Timestamp scheduleStartTime) {
        this.scheduleStartTime = scheduleStartTime;
    }

    public Timestamp getScheduleDeadline() {
        return scheduleDeadline;
    }

    public void setScheduleDeadline(Timestamp scheduleDeadline) {
        this.scheduleDeadline = scheduleDeadline;
    }

    public void setScheduleRepeatType(Integer scheduleRepeatType) {
        this.scheduleRepeatType = scheduleRepeatType;
    }

    public int getScheduleRepeatType() {
        return scheduleRepeatType;
    }

    public void setScheduleRepeatType(int scheduleRepeatType) {
        this.scheduleRepeatType = scheduleRepeatType;
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
    }

    public String getScheduleStatus() {
        return scheduleStatus;
    }

    public void setScheduleStatus(String scheduleStatus) {
        this.scheduleStatus = scheduleStatus;
    }

    public Integer getCreateId() {
        return createId;
    }

    public void setCreateId(Integer createId) {
        this.createId = createId;
    }
}
