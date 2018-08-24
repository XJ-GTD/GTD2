package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "gtd_group", schema = "gtd")
public class GtdGroupEntity {
    private int groupId;
    private String groupName;
    private int userId;
    private String groupHeadimgUrl;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;
    private Set<GtdLabelEntity> label;

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
    @Column(name = "USER_ID")
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "GROUP_HEADIMG_URL")
    public String getGroupHeadimgUrl() {
        return groupHeadimgUrl;
    }

    public void setGroupHeadimgUrl(String groupHeadimgUrl) {
        this.groupHeadimgUrl = groupHeadimgUrl;
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
                userId == that.userId &&
                Objects.equals(groupName, that.groupName) &&
                Objects.equals(groupHeadimgUrl, that.groupHeadimgUrl) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(groupId, groupName, userId, groupHeadimgUrl, createId, createDate, updateId, updateDate);
    }

    @ManyToOne(cascade = CascadeType.PERSIST,fetch = FetchType.LAZY)
    @JoinTable(name = "gtd_group_label",
            joinColumns = {@JoinColumn(name="GROUP_ID",referencedColumnName = "GROUP_ID",nullable = false)},
    inverseJoinColumns = {@JoinColumn(name="LABEL_ID",referencedColumnName = "LABEL_ID",nullable = false)})
    public Set<GtdLabelEntity> getLabel() {
        return label;
    }

    public void setLabel(Set<GtdLabelEntity> label) {
        this.label = label;
    }
}
