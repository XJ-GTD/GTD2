package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

/**
 *  日程标签表
 *  @author cp
 *  @since 2018/8/29
 */
@Entity
@Table(name = "gtd_schedule_label", schema = "gtd")
public class GtdScheduleLabelEntity {
    private Integer scheduleLabelId;
    private Integer scheduleId;
    private Integer labelId;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SCHEDULE_LABEL_ID")
    public Integer getScheduleLabelId() {
        return scheduleLabelId;
    }

    public void setScheduleLabelId(Integer scheduleLabelId) {
        this.scheduleLabelId = scheduleLabelId;
    }

    @Basic
    @Column(name = "SCHEDULE_ID")
    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    @Basic
    @Column(name = "LABEL_ID")
    public Integer getLabelId() {
        return labelId;
    }

    public void setLabelId(Integer labelId) {
        this.labelId = labelId;
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
        GtdScheduleLabelEntity that = (GtdScheduleLabelEntity) o;
        return Objects.equals(scheduleLabelId, that.scheduleLabelId) &&
                Objects.equals(scheduleId, that.scheduleId) &&
                Objects.equals(labelId, that.labelId) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(scheduleLabelId, scheduleId, labelId, createId, createDate, updateId, updateDate);
    }
}
