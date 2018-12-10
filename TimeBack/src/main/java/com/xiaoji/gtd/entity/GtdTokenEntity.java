package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_token", schema = "gtd", catalog = "")
public class GtdTokenEntity {
    private String token;
    private String userId;
    private String deviceId;
    private String accountQueue;
    private Timestamp createDate;
    private String updateId;
    private Timestamp updateDate;
    private String createId;

    @Id
    @Column(name = "TOKEN")
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Basic
    @Column(name = "USER_ID")
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "DEVICE_ID")
    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    @Basic
    @Column(name = "ACCOUNT_QUEUE")
    public String getAccountQueue() {
        return accountQueue;
    }

    public void setAccountQueue(String accountQueue) {
        this.accountQueue = accountQueue;
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
    public String getUpdateId() {
        return updateId;
    }

    public void setUpdateId(String updateId) {
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

    @Basic
    @Column(name = "CREATE_ID")
    public String getCreateId() {
        return createId;
    }

    public void setCreateId(String createId) {
        this.createId = createId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GtdTokenEntity that = (GtdTokenEntity) o;
        return Objects.equals(token, that.token) &&
                Objects.equals(userId, that.userId) &&
                Objects.equals(deviceId, that.deviceId) &&
                Objects.equals(accountQueue, that.accountQueue) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate) &&
                Objects.equals(createId, that.createId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(token, userId, deviceId, accountQueue, createDate, updateId, updateDate, createId);
    }
}
