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
@Table(name = "gtd_schedule", schema = "gtd")
public class GtdScheduleEntity {
    private int scheduleId;
    private String scheduleName;
    private Timestamp scheduleStarttime;
    private Timestamp scheduleDeadline;
    private String scheduleLaber;
    private String scheduleType;
    private Integer scheduleRepeatType;
    private String scheduleRepeatCycle;
    private Integer scheduleRemindType;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;
    private Set<GtdGroupEntity> relevance;  //与群组表，群组事件中间表成多对多关系
    private Set<GtdUserEntity> relatedParty; //与用户表，用户事件中间表成多对多关系

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SCHEDULE_ID")
    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
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
    @Column(name = "SCHEDULE_LABER")
    public String getScheduleLaber() {
        return scheduleLaber;
    }

    public void setScheduleLaber(String scheduleLaber) {
        this.scheduleLaber = scheduleLaber;
    }

    @Basic
    @Column(name = "SCHEDULE_TYPE")
    public String getScheduleType() {
        return scheduleType;
    }

    public void setScheduleType(String scheduleType) {
        this.scheduleType = scheduleType;
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
    @Column(name = "SCHEDULE_REPEAT_CYCLE")
    public String getScheduleRepeatCycle() {
        return scheduleRepeatCycle;
    }

    public void setScheduleRepeatCycle(String scheduleRepeatCycle) {
        this.scheduleRepeatCycle = scheduleRepeatCycle;
    }

    @Basic
    @Column(name = "SCHEDULE_REMIND_TYPE")
    public Integer getScheduleRemindType() {
        return scheduleRemindType;
    }

    public void setScheduleRemindType(Integer scheduleRemindType) {
        this.scheduleRemindType = scheduleRemindType;
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
        return scheduleId == that.scheduleId &&
                Objects.equals(scheduleName, that.scheduleName) &&
                Objects.equals(scheduleStarttime, that.scheduleStarttime) &&
                Objects.equals(scheduleDeadline, that.scheduleDeadline) &&
                Objects.equals(scheduleLaber, that.scheduleLaber) &&
                Objects.equals(scheduleType, that.scheduleType) &&
                Objects.equals(scheduleRepeatType, that.scheduleRepeatType) &&
                Objects.equals(scheduleRepeatCycle, that.scheduleRepeatCycle) &&
                Objects.equals(scheduleRemindType, that.scheduleRemindType) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(scheduleId, scheduleName, scheduleStarttime, scheduleDeadline, scheduleLaber, scheduleType, scheduleRepeatType, scheduleRepeatCycle, scheduleRemindType, createId, createDate, updateId, updateDate);
    }

    //添加群组关联
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "gtd_group_schedule", schema = "gtd", joinColumns = @JoinColumn(name = "SCHEDULE_ID", referencedColumnName = "SCHEDULE_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "GROUP_ID", referencedColumnName = "GROUP_ID", nullable = false))
    public Set<GtdGroupEntity> getRelevance() {
        return relevance;
    }

    public void setRelevance(Set<GtdGroupEntity> relevance) {
        this.relevance = relevance;
    }

    //添加用户关联
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "gtd_user_shcedule", schema = "gtd", joinColumns = @JoinColumn(name = "SCHEDULE_ID", referencedColumnName = "SCHEDULE_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID", nullable = false))
    public Set<GtdUserEntity> getRelatedParty() {
        return relatedParty;
    }

    public void setRelatedParty(Set<GtdUserEntity> relatedParty) {
        this.relatedParty = relatedParty;
    }
}
