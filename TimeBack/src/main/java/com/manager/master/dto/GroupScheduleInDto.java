package com.manager.master.dto;

public class GroupScheduleInDto {
    private int groupScheduleId;
    private int groupId;
    private int scheduleId;
    private int createId;
    private String createDate;
    private int updateId;
    private String updateDt;

    public int getGroupScheduleId() {
        return groupScheduleId;
    }

    public void setGroupScheduleId(int groupScheduleId) {
        this.groupScheduleId = groupScheduleId;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
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

    public String getUpdateDt() {
        return updateDt;
    }

    public void setUpdateDt(String updateDt) {
        this.updateDt = updateDt;
    }

    @Override
    public String toString() {
        return "GroupScheduleInDto{" +
                "groupScheduleId=" + groupScheduleId +
                ", groupId=" + groupId +
                ", scheduleId=" + scheduleId +
                ", createId=" + createId +
                ", createDate='" + createDate + '\'' +
                ", updateId=" + updateId +
                ", updateDt='" + updateDt + '\'' +
                '}';
    }
}
