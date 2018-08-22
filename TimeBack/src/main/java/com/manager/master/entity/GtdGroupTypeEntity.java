package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_group_type", schema = "gtd")
public class GtdGroupTypeEntity {
    private int groupTypeId;
    private String groupPermission;
    private String groupTypeName;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "GROUP_TYPE_ID")
    public int getGroupTypeId() {
        return groupTypeId;
    }

    public void setGroupTypeId(int groupTypeId) {
        this.groupTypeId = groupTypeId;
    }

    @Basic
    @Column(name = "GROUP_PERMISSION")
    public String getGroupPermission() {
        return groupPermission;
    }

    public void setGroupPermission(String groupPermission) {
        this.groupPermission = groupPermission;
    }

    @Basic
    @Column(name = "GROUP_TYPE_NAME")
    public String getGroupTypeName() {
        return groupTypeName;
    }

    public void setGroupTypeName(String groupTypeName) {
        this.groupTypeName = groupTypeName;
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
        GtdGroupTypeEntity that = (GtdGroupTypeEntity) o;
        return groupTypeId == that.groupTypeId &&
                Objects.equals(groupPermission, that.groupPermission) &&
                Objects.equals(groupTypeName, that.groupTypeName) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(groupTypeId, groupPermission, groupTypeName, createId, createDate, updateId, updateDate);
    }
}
