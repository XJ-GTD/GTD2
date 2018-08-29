package com.manager.master.dto;


import java.util.Date;
import java.util.List;

/**
 * 日程
 * @author cp
 * @since 2018/8/27
 */
public class ScheduleInDto {

    private int userId;                             // 用户ID
    private String scheduleName;                    // 日程事件名称
    private String scheduleStartTime;              // 开始时间
    private String scheduleDeadline;               // 截止时间
    private int scheduleRepeatType;               // 日程重复类型
    private String scheduleStatus;                 // 完成状态
    private int createId;                          // 创建人
    private String createDate;                     // 创建日期
    private int updateId;                          // 更新人
    private String updateDate;                     // 更新时间

    private List groupIds;                          // 群组 List
    private List labelIds;                          // 标签 List
    private List groupScheduleIds;                 // 群组日程 List
    private List scheduleLabelIds;                 // 日程标签 List

    @Override
    public String toString() {
        return "ScheduleInDto{" +
                "userId=" + userId +
                ", scheduleName='" + scheduleName + '\'' +
                ", scheduleStartTime='" + scheduleStartTime + '\'' +
                ", scheduleDeadline='" + scheduleDeadline + '\'' +
                ", scheduleRepeatType=" + scheduleRepeatType +
                ", scheduleStatus='" + scheduleStatus + '\'' +
                ", createId=" + createId +
                ", createDate='" + createDate + '\'' +
                ", updateId=" + updateId +
                ", updateDate='" + updateDate + '\'' +
                ", groupIds=" + groupIds +
                ", labelIds=" + labelIds +
                ", groupScheduleIds=" + groupScheduleIds +
                ", scheduleLabelIds=" + scheduleLabelIds +
                '}';
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    public String getScheduleStartTime() {
        return scheduleStartTime;
    }

    public void setScheduleStartTime(String scheduleStartTime) {
        this.scheduleStartTime = scheduleStartTime;
    }

    public String getScheduleDeadline() {
        return scheduleDeadline;
    }

    public void setScheduleDeadline(String scheduleDeadline) {
        this.scheduleDeadline = scheduleDeadline;
    }

    public int getScheduleRepeatType() {
        return scheduleRepeatType;
    }

    public void setScheduleRepeatType(int scheduleRepeatType) {
        this.scheduleRepeatType = scheduleRepeatType;
    }

    public String getScheduleStatus() {
        return scheduleStatus;
    }

    public void setScheduleStatus(String scheduleStatus) {
        this.scheduleStatus = scheduleStatus;
    }

    public int getCreateId() {
        return createId;
    }

    public void setCreateId(int createId) {
        this.createId = createId;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public int getUpdateId() {
        return updateId;
    }

    public void setUpdateId(int updateId) {
        this.updateId = updateId;
    }

    public String getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(String updateDate) {
        this.updateDate = updateDate;
    }

    public List getGroupIds() {
        return groupIds;
    }

    public void setGroupIds(List groupIds) {
        this.groupIds = groupIds;
    }

    public List getLabelIds() {
        return labelIds;
    }

    public void setLabelIds(List labelIds) {
        this.labelIds = labelIds;
    }

    public List getGroupScheduleIds() {
        return groupScheduleIds;
    }

    public void setGroupScheduleIds(List groupScheduleIds) {
        this.groupScheduleIds = groupScheduleIds;
    }

    public List getScheduleLabelIds() {
        return scheduleLabelIds;
    }

    public void setScheduleLabelIds(List scheduleLabelIds) {
        this.scheduleLabelIds = scheduleLabelIds;
    }
}
