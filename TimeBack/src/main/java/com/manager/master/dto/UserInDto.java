package com.manager.master.dto;

import java.util.Date;

/**
 * create by wzy on 201/05/03
 * 用户登陆返回信息类
 */
public class UserInDto {

    private String accountMobile;       //手机号
    private String accountWechat;       //微信
    private String accountQq;           // QQ
    private String accountPassword;     //登陆密码
    private String accountName;         //唯一标识码
    private int loginType;           //登陆类型
    private String userName;            //用户昵称

    public String getAccountMobile() {
        return accountMobile;
    }

    public void setAccountMobile(String accountMobile) {
        this.accountMobile = accountMobile;
    }

    public String getAccountWechat() {
        return accountWechat;
    }

    public void setAccountWechat(String accountWechat) {
        this.accountWechat = accountWechat;
    }

    public String getAccountQq() {
        return accountQq;
    }

    public void setAccountQq(String accountQq) {
        this.accountQq = accountQq;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }

    public int getLoginType() {
        return loginType;
    }

    public void setLoginType(int loginType) {
        this.loginType = loginType;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }
}
