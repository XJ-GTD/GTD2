package com.manager.master.dto;


import java.util.List;

/**
 * 日程
 * @author cp
 * @since 2018/8/27
 */
public class ScheduleInDto {

    private int userId;                            // 用户ID
    private int scheduleId;                        // 日程事件ID
    private String scheduleName;                   // 日程事件名称
    private String scheduleStartTime;             // 开始时间
    private String scheduleDeadline;              // 截止时间
    private Integer scheduleRepeatType;           // 日程重复类型
    private Integer scheduleStatus;                // 完成状态
    private int createId;                          // 创建人
    private String createDate;                     // 创建日期
    private int updateId;                          // 更新人
    private String updateDate;                     // 更新时间
    private List<Integer> groupIds;                          // 群组 List
    private List<Integer> labelIds;                          // 标签 List
    private List<Integer> groupScheduleIds;                 // 群组日程 List
    private List<Integer> scheduleLabelIds;                 // 日程标签 List

    private String deviceId;

    private Integer playersStatus;                     // 参与人状态ID

    @Override
    public String toString() {
        return "ScheduleInDto{" +
                "userId=" + userId +
                ", scheduleId=" + scheduleId +
                ", scheduleName='" + scheduleName + '\'' +
                ", scheduleStartTime='" + scheduleStartTime + '\'' +
                ", scheduleDeadline='" + scheduleDeadline + '\'' +
                ", scheduleRepeatType=" + scheduleRepeatType +
                ", scheduleStatus=" + scheduleStatus +
                ", createId=" + createId +
                ", createDate='" + createDate + '\'' +
                ", updateId=" + updateId +
                ", updateDate='" + updateDate + '\'' +
                ", groupIds=" + groupIds +
                ", labelIds=" + labelIds +
                ", groupScheduleIds=" + groupScheduleIds +
                ", scheduleLabelIds=" + scheduleLabelIds +
                ", playersStatus=" + playersStatus +
                '}';
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
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

    public Integer getScheduleRepeatType() {
        return scheduleRepeatType;
    }

    public void setScheduleRepeatType(Integer scheduleRepeatType) {
        this.scheduleRepeatType = scheduleRepeatType;
    }

    public Integer getScheduleStatus() {
        return scheduleStatus;
    }

    public void setScheduleStatus(Integer scheduleStatus) {
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

    public List<Integer> getGroupIds() {
        return groupIds;
    }

    public void setGroupIds(List<Integer> groupIds) {
        this.groupIds = groupIds;
    }

    public List<Integer> getLabelIds() {
        return labelIds;
    }

    public void setLabelIds(List<Integer> labelIds) {
        this.labelIds = labelIds;
    }

    public List<Integer> getGroupScheduleIds() {
        return groupScheduleIds;
    }

    public void setGroupScheduleIds(List<Integer> groupScheduleIds) {
        this.groupScheduleIds = groupScheduleIds;
    }

    public List<Integer> getScheduleLabelIds() {
        return scheduleLabelIds;
    }

    public void setScheduleLabelIds(List<Integer> scheduleLabelIds) {
        this.scheduleLabelIds = scheduleLabelIds;
    }


    public Integer getPlayersStatus() {
        return playersStatus;
    }

    public void setPlayersStatus(Integer playersStatus) {
        this.playersStatus = playersStatus;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
}
