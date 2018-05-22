package com.manager.master.bean;

/**
 * create by wzy on 2018/04/24.
 * 用户信息类
 */
public class UserInfoBean {

    private int userId;	        //用户ID
    private int accountId;     //账户ID
    private String userName;	    //昵称
    private String email;         //邮箱
    private String realName; 	//姓名
    private String idNumber; 	//身份证号
    private String userHead; 	//头像URL


    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getUserHead() {
        return userHead;
    }

    public void setUserHead(String userHead) {
        this.userHead = userHead;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }
}
