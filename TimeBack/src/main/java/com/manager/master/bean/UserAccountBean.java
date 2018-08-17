package com.manager.master.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * create by wzy on 2018/04/24.
 * 用户账户类
 */
@Entity(name = "gtd_account")
public class UserAccountBean {

    @Id
    @Column(name = "ACCOUNT_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int accountId;             //账户ID

    @Column(name = "ACCOUNT_NAME")
    private String accountName;        //账户名

    @Column(name = "ACCOUNT_PASSWORD")
    private String accountPassword;    //账户密码

    @Column(name = "ACCOUNT_MOBILE")
    private String accountMobile;      //手机号

    @Column(name = "USER_ID")
    private Integer userId;                //用户ID


    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }

    public String getAccountMobile() {
        return accountMobile;
    }

    public void setAccountMobile(String accountMobile) {
        this.accountMobile = accountMobile;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

}
