package com.xiaoji.gtd.dto;

/**
 * create by wzy on 201/05/03
 * 用户登陆信息入参类
 */
public class UpdatePWDInDto {

    private String oldPassword;     //旧密码
    private String password;     //登陆密码
    private String authCode;            //验证码
    private String userId;              // 用户ID

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }
}
