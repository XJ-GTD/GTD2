package com.manager.master.dto;

/**
 * 用户登陆信息输出类
 *
 * create by wzy on 2018/04/26
 */
public class UserOutDto {

    private Integer userId;                 //用户ID
    private Integer accountId;              //账户ID
    private String userName;            //昵称
    private String headimgUrl;          //头像URL
    private String brithday;            //生日
    private Integer userSex;            //性别
    private String userContact;         //联系方式
    private String accountName;         //账户名
    private String accountMobile;       //账户手机号
    private String accountWechat;       //账户微信
    private String accountQq;           //账户QQ
    private String accountEmail;        //账户邮箱
    private String accountUuid;         //唯一标识码
    private String accountQueue;        //消息队列

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getHeadimgUrl() {
        return headimgUrl;
    }

    public void setHeadimgUrl(String headimgUrl) {
        this.headimgUrl = headimgUrl;
    }

    public String getBrithday() {
        return brithday;
    }

    public void setBrithday(String brithday) {
        this.brithday = brithday;
    }

    public Integer getUserSex() {
        return userSex;
    }

    public void setUserSex(Integer userSex) {
        this.userSex = userSex;
    }

    public String getUserContact() {
        return userContact;
    }

    public void setUserContact(String userContact) {
        this.userContact = userContact;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
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

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public String getAccountUuid() {
        return accountUuid;
    }

    public void setAccountUuid(String accountUuid) {
        this.accountUuid = accountUuid;
    }

    public String getAccountQueue() {
        return accountQueue;
    }

    public void setAccountQueue(String accountQueue) {
        this.accountQueue = accountQueue;
    }

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }
}
