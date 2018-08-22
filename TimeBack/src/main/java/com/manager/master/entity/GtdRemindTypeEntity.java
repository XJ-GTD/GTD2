package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_remind_type", schema = "gtd")
public class GtdRemindTypeEntity {
    private int remindTypeId;
    private String remindTypeName;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "REMIND_TYPE_ID")
    public int getRemindTypeId() {
        return remindTypeId;
    }

    public void setRemindTypeId(int remindTypeId) {
        this.remindTypeId = remindTypeId;
    }

    @Basic
    @Column(name = "REMIND_TYPE_NAME")
    public String getRemindTypeName() {
        return remindTypeName;
    }

    public void setRemindTypeName(String remindTypeName) {
        this.remindTypeName = remindTypeName;
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
        GtdRemindTypeEntity that = (GtdRemindTypeEntity) o;
        return remindTypeId == that.remindTypeId &&
                Objects.equals(remindTypeName, that.remindTypeName) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(remindTypeId, remindTypeName, createId, createDate, updateId, updateDate);
    }
}
