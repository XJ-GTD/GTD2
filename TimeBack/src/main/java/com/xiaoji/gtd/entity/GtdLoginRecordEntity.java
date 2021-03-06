package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_login_record", schema = "gtd", catalog = "")
public class GtdLoginRecordEntity {
    private long id;
    private String userId;
    private String deviceId;
    private Timestamp loginTime;
    private String loginLocaltion;
    private String loginIp;
    private String token;
    private String createId;
    private Timestamp createDate;
    private String updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "ID", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Basic
    @Column(name = "USER_ID", nullable = false, length = 50)
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "DEVICE_ID", nullable = false, length = 100)
    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    @Basic
    @Column(name = "LOGIN_TIME", nullable = true)
    public Timestamp getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(Timestamp loginTime) {
        this.loginTime = loginTime;
    }

    @Basic
    @Column(name = "LOGIN_LOCALTION", nullable = true, length = 50)
    public String getLoginLocaltion() {
        return loginLocaltion;
    }

    public void setLoginLocaltion(String loginLocaltion) {
        this.loginLocaltion = loginLocaltion;
    }

    @Basic
    @Column(name = "LOGIN_IP", nullable = true, length = 50)
    public String getLoginIp() {
        return loginIp;
    }

    public void setLoginIp(String loginIp) {
        this.loginIp = loginIp;
    }

    @Basic
    @Column(name = "TOKEN", nullable = false, length = 250)
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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
        GtdLoginRecordEntity that = (GtdLoginRecordEntity) o;
        return id == that.id &&
                Objects.equals(userId, that.userId) &&
                Objects.equals(deviceId, that.deviceId) &&
                Objects.equals(loginTime, that.loginTime) &&
                Objects.equals(loginLocaltion, that.loginLocaltion) &&
                Objects.equals(loginIp, that.loginIp) &&
                Objects.equals(token, that.token) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, deviceId, loginTime, loginLocaltion, loginIp, token, createId, createDate, updateId, updateDate);
    }
}
