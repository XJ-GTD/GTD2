package com.manager.master.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.ibatis.annotations.One;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 *
 * create by wzy on 2018/08/22
 */
@Entity
@Table(name = "gtd_user", schema = "gtd")
public class GtdUserEntity {
    private int userId;
    private String userName;
    private String headimgUrl;
    private String brithday;
    private Integer userSex;
    private String userContact;
    private int userType;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;
    private GtdAccountEntity account;
    private Set<GtdScheduleEntity> schedule;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "USER_NAME")
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Basic
    @Column(name = "HEADIMG_URL")
    public String getHeadimgUrl() {
        return headimgUrl;
    }

    public void setHeadimgUrl(String headimgUrl) {
        this.headimgUrl = headimgUrl;
    }

    @Basic
    @Column(name = "BRITHDAY")
    public String getBrithday() {
        return brithday;
    }

    public void setBrithday(String brithday) {
        this.brithday = brithday;
    }

    @Basic
    @Column(name = "USER_SEX")
    public Integer getUserSex() {
        return userSex;
    }

    public void setUserSex(Integer userSex) {
        this.userSex = userSex;
    }

    @Basic
    @Column(name = "USER_CONTACT")
    public String getUserContact() {
        return userContact;
    }

    public void setUserContact(String userContact) {
        this.userContact = userContact;
    }

    @Basic
    @Column(name = "USER_TYPE")
    public int getUserType() {
        return userType;
    }

    public void setUserType(int userType) {
        this.userType = userType;
    }

    @Basic
    @Column(name = "CREATE_ID")
    public Integer getCreateId() {
        return createId;
    }

    public void setCreateId(Integer createId) {
        this.createId = createId;
    }

    @Basic
    @Column(name = "CREATE_DATE")
    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }

    @Basic
    @Column(name = "UPDATE_ID")
    public Integer getUpdateId() {
        return updateId;
    }

    public void setUpdateId(Integer updateId) {
        this.updateId = updateId;
    }

    @Basic
    @Column(name = "UPDATE_DATE")
    public Timestamp getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Timestamp updateDate) {
        this.updateDate = updateDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GtdUserEntity that = (GtdUserEntity) o;
        return userId == that.userId &&
                userType == that.userType &&
                Objects.equals(userName, that.userName) &&
                Objects.equals(headimgUrl, that.headimgUrl) &&
                Objects.equals(brithday, that.brithday) &&
                Objects.equals(userSex, that.userSex) &&
                Objects.equals(userContact, that.userContact) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(userId, userName, headimgUrl, brithday, userSex, userContact, userType, createId, createDate, updateId, updateDate);
    }

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinTable(name = "gtd_account", schema = "gtd", joinColumns = @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID", nullable = false))
    public GtdAccountEntity getAccount() {
        return account;
    }

    public void setAccount(GtdAccountEntity account) {
        this.account = account;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    public Set<GtdScheduleEntity> getSchedule() {
        return schedule;
    }

    public void setSchedule(Set<GtdScheduleEntity> schedule) {
        this.schedule = schedule;
    }
}
