package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

/**
 *
 * create by wzy on 2018/08/22
 */
@Entity
@Table(name = "gtd_remind", schema = "gtd", catalog = "")
public class GtdRemindEntity {
    private int remindId;
    private int subtablesId;
    private Timestamp remindDate;
    private Integer remindTypeId;
    private String remindReceptDate;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "REMIND_ID")
    public int getRemindId() {
        return remindId;
    }

    public void setRemindId(int remindId) {
        this.remindId = remindId;
    }

    @Basic
    @Column(name = "SUBTABLES_ID")
    public int getSubtablesId() {
        return subtablesId;
    }

    public void setSubtablesId(int subtablesId) {
        this.subtablesId = subtablesId;
    }

    @Basic
    @Column(name = "REMIND_DATE")
    public Timestamp getRemindDate() {
        return remindDate;
    }

    public void setRemindDate(Timestamp remindDate) {
        this.remindDate = remindDate;
    }

    @Basic
    @Column(name = "REMIND_TYPE_ID")
    public Integer getRemindTypeId() {
        return remindTypeId;
    }

    public void setRemindTypeId(Integer remindTypeId) {
        this.remindTypeId = remindTypeId;
    }

    @Basic
    @Column(name = "REMIND_RECEPT_DATE")
    public String getRemindReceptDate() {
        return remindReceptDate;
    }

    public void setRemindReceptDate(String remindReceptDate) {
        this.remindReceptDate = remindReceptDate;
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
        GtdRemindEntity that = (GtdRemindEntity) o;
        return remindId == that.remindId &&
                subtablesId == that.subtablesId &&
                Objects.equals(remindDate, that.remindDate) &&
                Objects.equals(remindTypeId, that.remindTypeId) &&
                Objects.equals(remindReceptDate, that.remindReceptDate) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(remindId, subtablesId, remindDate, remindTypeId, remindReceptDate, createId, createDate, updateId, updateDate);
    }
}
