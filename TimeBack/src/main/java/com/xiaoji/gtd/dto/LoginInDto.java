package com.xiaoji.gtd.dto;

/**
 * 登陆验证入参类
 *
 * create by wzy on 2018/11/20
 */
public class LoginInDto {
    private String userId;
    private String authCode;
    private String deviceId;
    private String account;
    private String password;
    private String loginIp;
    private String loginLocaltion;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getLoginIp() {
        return loginIp;
    }

    public void setLoginIp(String loginIp) {
        this.loginIp = loginIp;
    }

    public String getLoginLocaltion() {
        return loginLocaltion;
    }

    public void setLoginLocaltion(String loginLocaltion) {
        this.loginLocaltion = loginLocaltion;
    }
}
