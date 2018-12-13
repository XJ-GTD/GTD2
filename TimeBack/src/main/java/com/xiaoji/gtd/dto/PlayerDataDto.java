package com.xiaoji.gtd.dto;

/**
 * 业务处理参与人List用
 *
 * create by wzy on 2018/12/13
 */
public class PlayerDataDto {
    private String accountMobile;
    private String userId;
    private boolean isUser;
    private boolean isAgree;
    private boolean isPlayer;

    public String getAccountMobile() {
        return accountMobile;
    }

    public void setAccountMobile(String accountMobile) {
        this.accountMobile = accountMobile;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isAgree() {
        return isAgree;
    }

    public void setAgree(boolean agree) {
        isAgree = agree;
    }

    public boolean isUser() {
        return isUser;
    }

    public void setUser(boolean user) {
        isUser = user;
    }

    public boolean isPlayer() {
        return isPlayer;
    }

    public void setPlayer(boolean player) {
        isPlayer = player;
    }
}
