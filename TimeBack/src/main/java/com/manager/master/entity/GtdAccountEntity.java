package com.manager.master.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "gtd_account", schema = "gtd", catalog = "")
public class GtdAccountEntity {
    private int accountId;
    private String accountName;
    private String accountPassword;
    private String accountMobile;
    private Integer userId;

    @Id
    @Column(name = "ACCOUNT_ID")
    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
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
    @Column(name = "ACCOUNT_PASSWORD")
    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
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
    @Column(name = "USER_ID")
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GtdAccountEntity that = (GtdAccountEntity) o;
        return accountId == that.accountId &&
                Objects.equals(accountName, that.accountName) &&
                Objects.equals(accountPassword, that.accountPassword) &&
                Objects.equals(accountMobile, that.accountMobile) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(accountId, accountName, accountPassword, accountMobile, userId);
    }
}
