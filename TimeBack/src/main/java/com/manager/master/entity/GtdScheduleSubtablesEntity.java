package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_schedule_subtables", schema = "gtd")
public class GtdScheduleSubtablesEntity {
    private int subtablesId;
    private int scheduleId;
    private int scheduleStatus;
    private Timestamp scheduleFinishDate;
    private int userId;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "SUBTABLES_ID")
    public int getSubtablesId() {
        return subtablesId;
    }

    public void setSubtablesId(int subtablesId) {
        this.subtablesId = subtablesId;
    }

    @Basic
    @Column(name = "SCHEDULE_ID")
    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
    }

    @Basic
    @Column(name = "SCHEDULE_STATUS")
    public int getScheduleStatus() {
        return scheduleStatus;
    }

    public void setScheduleStatus(int scheduleStatus) {
        this.scheduleStatus = scheduleStatus;
    }

    @Basic
    @Column(name = "SCHEDULE_FINISH_DATE")
    public Timestamp getScheduleFinishDate() {
        return scheduleFinishDate;
    }

    public void setScheduleFinishDate(Timestamp scheduleFinishDate) {
        this.scheduleFinishDate = scheduleFinishDate;
    }

    @Basic
    @Column(name = "USER_ID")
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "CREATE_ID")
    public Integer getCreateId() {
        return createId;
    }

    public void setCreateId(Integer createId) {
        this.createId = createId;
    }

    @Basic
    @Column(name = "CREATE_DATE")
    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }

    @Basic
    @Column(name = "UPDATE_ID")
    public Integer getUpdateId() {
        return updateId;
    }

    public void setUpdateId(Integer updateId) {
        this.updateId = updateId;
    }

    @Basic
    @Column(name = "UPDATE_DATE")
    public Timestamp getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Timestamp updateDate) {
        this.updateDate = updateDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GtdScheduleSubtablesEntity that = (GtdScheduleSubtablesEntity) o;
        return subtablesId == that.subtablesId &&
                scheduleId == that.scheduleId &&
                scheduleStatus == that.scheduleStatus &&
                userId == that.userId &&
                Objects.equals(scheduleFinishDate, that.scheduleFinishDate) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(subtablesId, scheduleId, scheduleStatus, scheduleFinishDate, userId, createId, createDate, updateId, updateDate);
    }
}
