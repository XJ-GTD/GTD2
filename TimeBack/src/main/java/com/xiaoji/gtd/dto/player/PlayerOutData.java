package com.xiaoji.gtd.dto.player;

/**
 * 参与人出参类
 *
 * create by wzy on 2019/01/17
 */
public class PlayerOutData {
    private String userId;
    private String headImg;
    private String userName;
    private String pyOfUserName;
    private String accountMobile;
    private boolean isAgree;     //是否同意发送

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAccountMobile() {
        return accountMobile;
    }

    public void setAccountMobile(String accountMobile) {
        this.accountMobile = accountMobile;
    }

    public String getHeadImg() {
        return headImg;
    }

    public void setHeadImg(String headImg) {
        this.headImg = headImg;
    }

    public boolean isAgree() {
        return isAgree;
    }

    public void setAgree(boolean agree) {
        isAgree = agree;
    }

    public String getPyOfUserName() {
        return pyOfUserName;
    }

    public void setPyOfUserName(String pyOfUserName) {
        this.pyOfUserName = pyOfUserName;
    }
}
