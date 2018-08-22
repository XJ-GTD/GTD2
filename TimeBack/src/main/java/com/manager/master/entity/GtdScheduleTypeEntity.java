package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_schedule_type", schema = "gtd")
public class GtdScheduleTypeEntity {
    private int scheduleTypeId;
    private String scheduleTypeName;
    private int schedulePermission;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "SCHEDULE_TYPE_ID")
    public int getScheduleTypeId() {
        return scheduleTypeId;
    }

    public void setScheduleTypeId(int scheduleTypeId) {
        this.scheduleTypeId = scheduleTypeId;
    }

    @Basic
    @Column(name = "SCHEDULE_TYPE_NAME")
    public String getScheduleTypeName() {
        return scheduleTypeName;
    }

    public void setScheduleTypeName(String scheduleTypeName) {
        this.scheduleTypeName = scheduleTypeName;
    }

    @Basic
    @Column(name = "SCHEDULE_PERMISSION")
    public int getSchedulePermission() {
        return schedulePermission;
    }

    public void setSchedulePermission(int schedulePermission) {
        this.schedulePermission = schedulePermission;
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
        GtdScheduleTypeEntity that = (GtdScheduleTypeEntity) o;
        return scheduleTypeId == that.scheduleTypeId &&
                schedulePermission == that.schedulePermission &&
                Objects.equals(scheduleTypeName, that.scheduleTypeName) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(scheduleTypeId, scheduleTypeName, schedulePermission, createId, createDate, updateId, updateDate);
    }
}
