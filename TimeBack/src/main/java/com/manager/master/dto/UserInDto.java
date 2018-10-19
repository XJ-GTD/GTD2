package com.manager.master.dto;

import java.util.Date;

/**
 * create by wzy on 201/05/03
 * 用户登陆信息入参类
 */
public class UserInDto {

    private Integer accountId;
    private String accountMobile;       //手机号
    private String accountWechat;       //微信
    private String accountQq;            //QQ
    private String accountPassword;     //登陆密码
    private String accountName;         //登陆名(登陆可输入手机号可为账户名)
    private String accountUuid;         //唯一标识码
    private String deviceId;
    private Integer loginType;           //登陆类型 0:手机或账户名登陆， 1：微信登陆， 2：QQ登陆

    private String userName;            //用户昵称
    private Integer userId;     // 用户ID
    private String headImgUrl;  // 用户头像
    private String birthday;    // 生日
    private String userSex;     // 性别
    private String userContact; // 联系方式

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getHeadImgUrl() {
        return headImgUrl;
    }

    public void setHeadImgUrl(String headImgUrl) {
        this.headImgUrl = headImgUrl;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getUserSex() {
        return userSex;
    }

    public void setUserSex(String userSex) {
        this.userSex = userSex;
    }

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

    public Integer getLoginType() {
        return loginType;
    }

    public void setLoginType(Integer loginType) {
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

    public String getAccountUuid() {
        return accountUuid;
    }

    public void setAccountUuid(String accountUuid) {
        this.accountUuid = accountUuid;
    }

    public String getUserContact() {
        return userContact;
    }

    public void setUserContact(String userContact) {
        this.userContact = userContact;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
}
