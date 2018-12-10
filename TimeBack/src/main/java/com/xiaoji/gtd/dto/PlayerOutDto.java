package com.xiaoji.gtd.dto;

/**
 *
 * create by wzy on 2018/12/05
 */
public class PlayerOutDto {

    private String userId;
    private String headImgUrl;
    private String userName;
    private String accountMobile;
    private boolean relaterFlag;     //是否同意发送

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getHeadImgUrl() {
        return headImgUrl;
    }

    public void setHeadImgUrl(String headImgUrl) {
        this.headImgUrl = headImgUrl;
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

    public boolean isRelaterFlag() {
        return relaterFlag;
    }

    public void setRelaterFlag(boolean relaterFlag) {
        this.relaterFlag = relaterFlag;
    }
}
