package com.manager.master.dto;

/**
 *  用户资料编辑
 */
public class UserInfoInDto {
    private Integer userId;     // 用户ID
    private String userName;    // 昵称
    private String headimgUrl;  // 用户头像
    private String birthday;    // 生日
    private String userSex;     // 性别
    private String userContent; // 联系方式

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

    public String getHeadimgUrl() {
        return headimgUrl;
    }

    public void setHeadimgUrl(String headimgUrl) {
        this.headimgUrl = headimgUrl;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getUserSex() {
        return userSex;
    }

    public void setUserSex(String userSex) {
        this.userSex = userSex;
    }

    public String getUserContent() {
        return userContent;
    }

    public void setUserContent(String userContent) {
        this.userContent = userContent;
    }

    @Override
    public String toString() {
        return "UserInfoInDto{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", headimgUrl='" + headimgUrl + '\'' +
                ", birthday='" + birthday + '\'' +
                ", userSex='" + userSex + '\'' +
                ", userContent='" + userContent + '\'' +
                '}';
    }
}
