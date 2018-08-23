package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;
import java.util.Set;

/**
 *
 * create by wzy on 2018/08/22
 */
@Entity
@Table(name = "gtd_group", schema = "gtd")
public class GtdGroupEntity {
    private int groupId;
    private String groupName;
    private String groupLabel;
    private String groupType;
    private Integer groupCreator;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;
    private Set<GtdScheduleEntity> schedules;
    private GtdUserEntity user_groups;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "GROUP_ID")
    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    @Basic
    @Column(name = "GROUP_NAME")
    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    @Basic
    @Column(name = "GROUP_LABEL")
    public String getGroupLabel() {
        return groupLabel;
    }

    public void setGroupLabel(String groupLabel) {
        this.groupLabel = groupLabel;
    }

    @Basic
    @Column(name = "GROUP_TYPE")
    public String getGroupType() {
        return groupType;
    }

    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }

    @Basic
    @Column(name = "GROUP_CREATOR")
    public Integer getGroupCreator() {
        return groupCreator;
    }

    public void setGroupCreator(Integer groupCreator) {
        this.groupCreator = groupCreator;
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
        GtdGroupEntity that = (GtdGroupEntity) o;
        return groupId == that.groupId &&
                Objects.equals(groupName, that.groupName) &&
                Objects.equals(groupLabel, that.groupLabel) &&
                Objects.equals(groupType, that.groupType) &&
                Objects.equals(groupCreator, that.groupCreator) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(groupId, groupName, groupLabel, groupType, groupCreator, createId, createDate, updateId, updateDate);
    }

    @ManyToMany(mappedBy = "relevance")
    public Set<GtdScheduleEntity> getSchedules() {
        return schedules;
    }

    public void setSchedules(Set<GtdScheduleEntity> schedules) {
        this.schedules = schedules;
    }

    @ManyToOne(optional = false)
    @JoinColumn(name = "groups")
    public GtdUserEntity getUser_groups() {
        return user_groups;
    }

    public void setUser_groups(GtdUserEntity user_groups) {
        this.user_groups = user_groups;
    }
}
