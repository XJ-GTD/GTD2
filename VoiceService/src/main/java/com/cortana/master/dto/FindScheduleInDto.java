package com.xiaoji.master.dto;

/**
 * 日程查询 - 入参
 * @author myx
 * @since 2018/09/11
 */
public class FindScheduleInDto {
    private Integer userId;             // 用户ID
    private Integer scheduleId;         // 日程ID
    private String scheduleName;        // 日程主题
    private String scheduleStartTime;   // 开始时间
    private String scheduleDeadline;    // 截止时间
    private Integer labelId;             // 标签ID
    private String groupName;           // 参与人名称
    private Integer groupId;            // 参与人ID
    private String type;                // 标签

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

    public Integer getLabelId() {
        return labelId;
    }

    public void setLabelId(Integer labelId) {
        this.labelId = labelId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "FindScheduleInDto{" +
                "userId=" + userId +
                ", scheduleId=" + scheduleId +
                ", scheduleName='" + scheduleName + '\'' +
                ", scheduleStartTime='" + scheduleStartTime + '\'' +
                ", scheduleDeadline='" + scheduleDeadline + '\'' +
                ", labelId=" + labelId +
                ", groupName='" + groupName + '\'' +
                ", groupId=" + groupId +
                ", type='" + type + '\'' +
                '}';
    }
}
