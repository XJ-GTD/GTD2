package com.manager.master.dto;

import java.util.List;

/**
 * 日程查询 - 出参
 * @author myx
 * @since 2018/09/
 */
public class FindScheduleOutDto {
    private Integer scheduleId;         // 日程ID
    private String scheduleName;        // 日程主题
    private String scheduleStarttime;   // 开始时间
    private String scheduleDeadline;    // 截止时间
    private Integer scheduleStatus;     // 完成状态
    private String scheduleFinishDate;  // 完成时间
    private List<String> labelName;      // 标签名称
    private List<GroupOutDto> group;     // 参与人
    private List<RemindOutDto> remind;   // 提醒时间列表

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

    public String getScheduleStarttime() {
        return scheduleStarttime;
    }

    public void setScheduleStarttime(String scheduleStarttime) {
        this.scheduleStarttime = scheduleStarttime;
    }

    public String getScheduleDeadline() {
        return scheduleDeadline;
    }

    public void setScheduleDeadline(String scheduleDeadline) {
        this.scheduleDeadline = scheduleDeadline;
    }

    public Integer getScheduleStatus() {
        return scheduleStatus;
    }

    public void setScheduleStatus(Integer scheduleStatus) {
        this.scheduleStatus = scheduleStatus;
    }

    public String getScheduleFinishDate() {
        return scheduleFinishDate;
    }

    public void setScheduleFinishDate(String scheduleFinishDate) {
        this.scheduleFinishDate = scheduleFinishDate;
    }

    public List<String> getLabelName() {
        return labelName;
    }

    public void setLabelName(List<String> labelName) {
        this.labelName = labelName;
    }

    public List<GroupOutDto> getGroup() {
        return group;
    }

    public void setGroup(List<GroupOutDto> group) {
        this.group = group;
    }

    public List<RemindOutDto> getRemind() {
        return remind;
    }

    public void setRemind(List<RemindOutDto> remind) {
        this.remind = remind;
    }

    @Override
    public String toString() {
        return "FindScheduleOutDto{" +
                "scheduleId=" + scheduleId +
                ", scheduleName='" + scheduleName + '\'' +
                ", scheduleStarttime='" + scheduleStarttime + '\'' +
                ", scheduleDeadline='" + scheduleDeadline + '\'' +
                ", scheduleStatus=" + scheduleStatus +
                ", scheduleFinishDate='" + scheduleFinishDate + '\'' +
                ", labelName=" + labelName +
                ", group=" + group +
                ", remind=" + remind +
                '}';
    }
}
