package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

/**
 *
 * create by wzy on 2018/08/22
 */
@Entity
@Table(name = "gtd_login_record", schema = "gtd", catalog = "")
public class GtdLoginRecordEntity {
    private int loginRecordId;
    private int accountId;
    private String deviceId;
    private Timestamp loginTime;
    private String loginIp;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "LOGIN_RECORD_ID")
    public int getLoginRecordId() {
        return loginRecordId;
    }

    public void setLoginRecordId(int loginRecordId) {
        this.loginRecordId = loginRecordId;
    }

    @Basic
    @Column(name = "ACCOUNT_ID")
    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
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
    @Column(name = "LOGIN_TIME")
    public Timestamp getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(Timestamp loginTime) {
        this.loginTime = loginTime;
    }

    @Basic
    @Column(name = "LOGIN_IP")
    public String getLoginIp() {
        return loginIp;
    }

    public void setLoginIp(String loginIp) {
        this.loginIp = loginIp;
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
        GtdLoginRecordEntity that = (GtdLoginRecordEntity) o;
        return loginRecordId == that.loginRecordId &&
                accountId == that.accountId &&
                Objects.equals(deviceId, that.deviceId) &&
                Objects.equals(loginTime, that.loginTime) &&
                Objects.equals(loginIp, that.loginIp) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(loginRecordId, accountId, deviceId, loginTime, loginIp, createId, createDate, updateId, updateDate);
    }
}
