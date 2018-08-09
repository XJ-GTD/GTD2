package com.manager.master.bean;

/**
 * create by wzy on 2018/04/24.
 * 用户账户类
 */
public class UserAccountBean {

    private int accountId;             //账户ID
    private String accountName;        //账户名
    private String accountPassword;    //账户密码
    private String accountMobile;      //手机号
    private int userId;                //用户ID

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

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
