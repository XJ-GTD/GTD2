package com.xiaoji.gtd.dto;

/**
 * 登陆验证返回类
 *
 * create by wzy on 2018/11/20
 */
public class LoginOutDto extends BaseOut {

    private String accountQueue;
    private String userId;
    private String token;

    private String userName;
    private String headImg;
    private String birthday;
    private String realName;
    private String idCard;
    private String userSex;

    public String getAccountQueue() {
        return accountQueue;
    }

    public void setAccountQueue(String accountQueue) {
        this.accountQueue = accountQueue;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public String getUserSex() {
        return userSex;
    }

    public void setUserSex(String userSex) {
        this.userSex = userSex;
    }

    public String getHeadImg() {
        return headImg;
    }

    public void setHeadImg(String headImg) {
        this.headImg = headImg;
    }
}
