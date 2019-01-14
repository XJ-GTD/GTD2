package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_execute", schema = "gtd", catalog = "")
public class GtdExecuteEntity {
    private String executeId;
    private String scheduleId;
    private String scheduleOtherName;
    private Integer scheduleAuth;
    private Integer executeStatus;
    private String userId;
    private String id;
    private String createId;
    private Timestamp createDate;
    private String updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "EXECUTE_ID", nullable = false, length = 50)
    public String getExecuteId() {
        return executeId;
    }

    public void setExecuteId(String executeId) {
        this.executeId = executeId;
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
    @Column(name = "SCHEDULE_OTHER_NAME", nullable = true, length = 50)
    public String getScheduleOtherName() {
        return scheduleOtherName;
    }

    public void setScheduleOtherName(String scheduleOtherName) {
        this.scheduleOtherName = scheduleOtherName;
    }

    @Basic
    @Column(name = "SCHEDULE_AUTH", nullable = true)
    public Integer getScheduleAuth() {
        return scheduleAuth;
    }

    public void setScheduleAuth(Integer scheduleAuth) {
        this.scheduleAuth = scheduleAuth;
    }

    @Basic
    @Column(name = "EXECUTE_STATUS", nullable = true)
    public Integer getExecuteStatus() {
        return executeStatus;
    }

    public void setExecuteStatus(Integer executeStatus) {
        this.executeStatus = executeStatus;
    }

    @Basic
    @Column(name = "USER_ID", nullable = true, length = 50)
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "ID", nullable = true, length = 50)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
        GtdExecuteEntity that = (GtdExecuteEntity) o;
        return Objects.equals(executeId, that.executeId) &&
                Objects.equals(scheduleId, that.scheduleId) &&
                Objects.equals(scheduleOtherName, that.scheduleOtherName) &&
                Objects.equals(scheduleAuth, that.scheduleAuth) &&
                Objects.equals(executeStatus, that.executeStatus) &&
                Objects.equals(userId, that.userId) &&
                Objects.equals(id, that.id) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(executeId, scheduleId, scheduleOtherName, scheduleAuth, executeStatus, userId, id, createId, createDate, updateId, updateDate);
    }
}
