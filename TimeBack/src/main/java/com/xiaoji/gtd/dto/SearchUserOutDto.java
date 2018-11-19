package com.xiaoji.gtd.dto;

/**
 * create by wzy on 201/05/03
 * 用户登陆信息入参类
 */
public class SearchUserOutDto extends BaseOut {
    private String userId;                 //用户ID
    private String accountMobile;       //账户手机号
    private String userName;            //昵称
    private String userContact;         //联系方式
    private String headImgUrl;          //头像URL
    private String birthday;            //生日
    private boolean relaterFlag;     //是否同意发送

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAccountMobile() {
        return accountMobile;
    }

    public void setAccountMobile(String accountMobile) {
        this.accountMobile = accountMobile;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserContact() {
        return userContact;
    }

    public void setUserContact(String userContact) {
        this.userContact = userContact;
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

    public boolean isRelaterFlag() {
        return relaterFlag;
    }

    public void setRelaterFlag(boolean relaterFlag) {
        this.relaterFlag = relaterFlag;
    }
}
