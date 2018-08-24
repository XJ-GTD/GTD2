package com.manager.master.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

/**
 *
 * create by wzy on 2018/08/22
 */
@Entity
@Table(name = "gtd_account", schema = "gtd")
public class GtdAccountEntity {
    private Integer accountId;
    private Integer userId;
    private String accountPassword;
    private String accountName;
    private String accountMobile;
    private String accountWechat;
    private String accountQq;
    private String accountEmail;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;
    private GtdUserEntity user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ACCOUNT_ID")
    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
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
    @Column(name = "ACCOUNT_PASSWORD")
    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }

    @Basic
    @Column(name = "ACCOUNT_NAME")
    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    @Basic
    @Column(name = "ACCOUNT_MOBILE")
    public String getAccountMobile() {
        return accountMobile;
    }

    public void setAccountMobile(String accountMobile) {
        this.accountMobile = accountMobile;
    }

    @Basic
    @Column(name = "ACCOUNT_WECHAT")
    public String getAccountWechat() {
        return accountWechat;
    }

    public void setAccountWechat(String accountWechat) {
        this.accountWechat = accountWechat;
    }

    @Basic
    @Column(name = "ACCOUNT_QQ")
    public String getAccountQq() {
        return accountQq;
    }

    public void setAccountQq(String accountQq) {
        this.accountQq = accountQq;
    }

    @Basic
    @Column(name = "ACCOUNT_EMAIL")
    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
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
        GtdAccountEntity that = (GtdAccountEntity) o;
        return Objects.equals(accountId, that.accountId) &&
                Objects.equals(userId, that.userId) &&
                Objects.equals(accountPassword, that.accountPassword) &&
                Objects.equals(accountName, that.accountName) &&
                Objects.equals(accountMobile, that.accountMobile) &&
                Objects.equals(accountWechat, that.accountWechat) &&
                Objects.equals(accountQq, that.accountQq) &&
                Objects.equals(accountEmail, that.accountEmail) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(accountId, userId, accountPassword, accountName, accountMobile, accountWechat, accountQq, accountEmail, createId, createDate, updateId, updateDate);
    }

    @OneToOne(mappedBy = "account")
    @JsonIgnore
    public GtdUserEntity getUser() {
        return user;
    }

    public void setUser(GtdUserEntity user) {
        this.user = user;
    }


}
