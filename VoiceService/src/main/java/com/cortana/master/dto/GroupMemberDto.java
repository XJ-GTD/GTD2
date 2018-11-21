package com.xiaoji.master.dto;

public class GroupMemberDto {
    private Integer userId;        //群成员ID
    private String userName;       //群成员姓名
    private String userContact;    //群成员联系方式
    private Integer userStatus;    //群成员状态

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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

    public Integer getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(Integer userStatus) {
        this.userStatus = userStatus;
    }
}
