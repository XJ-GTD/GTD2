package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;
import java.util.Set;

/**
 *  日程事件表
 *  @author cp
 *  @since 2018/8/24
 */
@Entity
@Table(name = "gtd_schedule", schema = "gtd")
public class GtdScheduleEntity {
    private Integer scheduleId;
    private String scheduleName;
    private Timestamp scheduleStarttime;
    private Timestamp scheduleDeadline;
    private Integer scheduleRepeatType;
    private Integer scheduleStatus;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;
    private Set<GtdGroupEntity> groupSchedule;
    private GtdUserEntity user;
    private Set<GtdLabelEntity> label;

    @OneToMany(mappedBy = "schedule")
    public Set<GtdLabelEntity> getLabel() {
        return label;
    }

    public void setLabel(Set<GtdLabelEntity> label) {
        this.label = label;
    }

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinTable(name = "gtd_user_schedule", schema = "gtd",
            joinColumns = @JoinColumn(name = "SCHEDULE_ID", referencedColumnName = "SCHEDULE_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID", nullable = false))
    public GtdUserEntity getUser() {
        return user;
    }

    public void setUser(GtdUserEntity user) {
        this.user = user;
    }

    @ManyToMany(cascade=CascadeType.ALL)
    @JoinTable(name = "gtd_group_schedule", schema = "gtd",
            joinColumns = @JoinColumn(name = "SCHEDULE_ID", referencedColumnName = "SCHEDULE_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "GROUP_ID", referencedColumnName = "GROUP_ID", nullable = false))
    public Set<GtdGroupEntity> getGroupSchedule() {
        return groupSchedule;
    }

    public void setGroupSchedule(Set<GtdGroupEntity> groupSchedule) {
        this.groupSchedule = groupSchedule;
    }



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SCHEDULE_ID")
    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    @Basic
    @Column(name = "SCHEDULE_NAME")
    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    @Basic
    @Column(name = "SCHEDULE_STARTTIME")
    public Timestamp getScheduleStarttime() {
        return scheduleStarttime;
    }

    public void setScheduleStarttime(Timestamp scheduleStarttime) {
        this.scheduleStarttime = scheduleStarttime;
    }

    @Basic
    @Column(name = "SCHEDULE_DEADLINE")
    public Timestamp getScheduleDeadline() {
        return scheduleDeadline;
    }

    public void setScheduleDeadline(Timestamp scheduleDeadline) {
        this.scheduleDeadline = scheduleDeadline;
    }

    @Basic
    @Column(name = "SCHEDULE_REPEAT_TYPE")
    public Integer getScheduleRepeatType() {
        return scheduleRepeatType;
    }

    public void setScheduleRepeatType(Integer scheduleRepeatType) {
        this.scheduleRepeatType = scheduleRepeatType;
    }

    @Basic
    @Column(name = "SCHEDULE_STATUS")
    public Integer getScheduleStatus() {
        return scheduleStatus;
    }

    public void setScheduleStatus(Integer scheduleStatus) {
        this.scheduleStatus = scheduleStatus;
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
        GtdScheduleEntity that = (GtdScheduleEntity) o;
        return Objects.equals(scheduleId, that.scheduleId) &&
                Objects.equals(scheduleName, that.scheduleName) &&
                Objects.equals(scheduleStarttime, that.scheduleStarttime) &&
                Objects.equals(scheduleDeadline, that.scheduleDeadline) &&
                Objects.equals(scheduleRepeatType, that.scheduleRepeatType) &&
                Objects.equals(scheduleStatus, that.scheduleStatus) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(scheduleId, scheduleName, scheduleStarttime, scheduleDeadline, scheduleRepeatType, scheduleStatus, createId, createDate, updateId, updateDate);
    }
}
