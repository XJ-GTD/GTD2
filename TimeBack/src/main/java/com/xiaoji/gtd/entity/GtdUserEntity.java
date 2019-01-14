package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_user", schema = "gtd", catalog = "")
public class GtdUserEntity {
    private String userId;
    private String userName;
    private String headImg;
    private String birthday;
    private String realName;
    private String idCard;
    private Integer userSex;
    private String userContact;
    private Integer userType;
    private String createId;
    private Timestamp createDate;
    private String updateId;
    private Timestamp updateDate;
    private String brithday;
    private String headimgUrl;

    @Id
    @Column(name = "USER_ID", nullable = false, length = 50)
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "USER_NAME", nullable = false, length = 20)
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Basic
    @Column(name = "HEAD_IMG", nullable = false, length = 200)
    public String getHeadImg() {
        return headImg;
    }

    public void setHeadImg(String headImg) {
        this.headImg = headImg;
    }

    @Basic
    @Column(name = "BIRTHDAY", nullable = true, length = 10)
    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    @Basic
    @Column(name = "REAL_NAME", nullable = true, length = 10)
    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    @Basic
    @Column(name = "ID_CARD", nullable = true, length = 20)
    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    @Basic
    @Column(name = "USER_SEX", nullable = true)
    public Integer getUserSex() {
        return userSex;
    }

    public void setUserSex(Integer userSex) {
        this.userSex = userSex;
    }

    @Basic
    @Column(name = "USER_CONTACT", nullable = true, length = 11)
    public String getUserContact() {
        return userContact;
    }

    public void setUserContact(String userContact) {
        this.userContact = userContact;
    }

    @Basic
    @Column(name = "USER_TYPE", nullable = true)
    public Integer getUserType() {
        return userType;
    }

    public void setUserType(Integer userType) {
        this.userType = userType;
    }

    @Basic
    @Column(name = "CREATE_ID", nullable = true, length = 50)
    public String getCreateId() {
        return createId;
    }

    public void setCreateId(String createId) {
        this.createId = createId;
    }

    @Basic
    @Column(name = "CREATE_DATE", nullable = true)
    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }

    @Basic
    @Column(name = "UPDATE_ID", nullable = true, length = 50)
    public String getUpdateId() {
        return updateId;
    }

    public void setUpdateId(String updateId) {
        this.updateId = updateId;
    }

    @Basic
    @Column(name = "UPDATE_DATE", nullable = true)
    public Timestamp getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Timestamp updateDate) {
        this.updateDate = updateDate;
    }

    @Basic
    @Column(name = "brithday", nullable = true, length = 255)
    public String getBrithday() {
        return brithday;
    }

    public void setBrithday(String brithday) {
        this.brithday = brithday;
    }

    @Basic
    @Column(name = "headimg_url", nullable = true, length = 255)
    public String getHeadimgUrl() {
        return headimgUrl;
    }

    public void setHeadimgUrl(String headimgUrl) {
        this.headimgUrl = headimgUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GtdUserEntity that = (GtdUserEntity) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(userName, that.userName) &&
                Objects.equals(headImg, that.headImg) &&
                Objects.equals(birthday, that.birthday) &&
                Objects.equals(realName, that.realName) &&
                Objects.equals(idCard, that.idCard) &&
                Objects.equals(userSex, that.userSex) &&
                Objects.equals(userContact, that.userContact) &&
                Objects.equals(userType, that.userType) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate) &&
                Objects.equals(brithday, that.brithday) &&
                Objects.equals(headimgUrl, that.headimgUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, userName, headImg, birthday, realName, idCard, userSex, userContact, userType, createId, createDate, updateId, updateDate, brithday, headimgUrl);
    }
}
