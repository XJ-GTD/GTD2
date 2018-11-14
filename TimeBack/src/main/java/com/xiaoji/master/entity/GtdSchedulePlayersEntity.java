package com.xiaoji.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

/**
 *  日程参与人表
 *  @author cp
 *  @since 2018/8/29
 */
@Entity
@Table(name = "gtd_schedule_players")
public class GtdSchedulePlayersEntity {
    private Integer playersId;
    private Integer scheduleId;
    private Integer playersStatus;
    private Timestamp playersFinishDate;
    private Integer userId;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PLAYERS_ID")
    public Integer getPlayersId() {
        return playersId;
    }

    public void setPlayersId(Integer playersId) {
        this.playersId = playersId;
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
    @Column(name = "PLAYERS_STATUS")
    public Integer getPlayersStatus() {
        return playersStatus;
    }

    public void setPlayersStatus(Integer playersStatus) {
        this.playersStatus = playersStatus;
    }

    @Basic
    @Column(name = "PLAYERS_FINISH_DATE")
    public Timestamp getPlayersFinishDate() {
        return playersFinishDate;
    }

    public void setPlayersFinishDate(Timestamp playersFinishDate) {
        this.playersFinishDate = playersFinishDate;
    }

    @Basic
    @Column(name = "USER_ID")
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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
        GtdSchedulePlayersEntity that = (GtdSchedulePlayersEntity) o;
        return Objects.equals(playersId, that.playersId) &&
                Objects.equals(scheduleId, that.scheduleId) &&
                Objects.equals(playersStatus, that.playersStatus) &&
                Objects.equals(playersFinishDate, that.playersFinishDate) &&
                Objects.equals(userId, that.userId) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(playersId, scheduleId, playersStatus, playersFinishDate, userId, createId, createDate, updateId, updateDate);
    }
}
