package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_schedule_d", schema = "gtd", catalog = "")
public class GtdScheduleDEntity {
    private String id;
    private String scheduleId;
    private String comment;
    private String repeatType;
    private String remindType;
    private Timestamp remindTime;
    private String createId;
    private Timestamp createDate;
    private String updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "ID", nullable = false, length = 50)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Basic
    @Column(name = "SCHEDULE_ID", nullable = false, length = 50)
    public String getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(String scheduleId) {
        this.scheduleId = scheduleId;
    }

    @Basic
    @Column(name = "COMMENT", nullable = true, length = 255)
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Basic
    @Column(name = "REPEAT_TYPE", nullable = true, length = 5)
    public String getRepeatType() {
        return repeatType;
    }

    public void setRepeatType(String repeatType) {
        this.repeatType = repeatType;
    }

    @Basic
    @Column(name = "REMIND_TYPE", nullable = true, length = 5)
    public String getRemindType() {
        return remindType;
    }

    public void setRemindType(String remindType) {
        this.remindType = remindType;
    }

    @Basic
    @Column(name = "REMIND_TIME", nullable = true)
    public Timestamp getRemindTime() {
        return remindTime;
    }

    public void setRemindTime(Timestamp remindTime) {
        this.remindTime = remindTime;
    }

    @Basic
    @Column(name = "CREATE_ID", nullable = true, length = 50)
    public String getCreateId() {
        return createId;
    }

    public void setCreateId(String createId) {
        this.createId = createId;
    }

    @Basic
    @Column(name = "CREATE_DATE", nullable = true)
    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }

    @Basic
    @Column(name = "UPDATE_ID", nullable = true, length = 50)
    public String getUpdateId() {
        return updateId;
    }

    public void setUpdateId(String updateId) {
        this.updateId = updateId;
    }

    @Basic
    @Column(name = "UPDATE_DATE", nullable = true)
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
        GtdScheduleDEntity that = (GtdScheduleDEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(scheduleId, that.scheduleId) &&
                Objects.equals(comment, that.comment) &&
                Objects.equals(repeatType, that.repeatType) &&
                Objects.equals(remindType, that.remindType) &&
                Objects.equals(remindTime, that.remindTime) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, scheduleId, comment, repeatType, remindType, remindTime, createId, createDate, updateId, updateDate);
    }
}
