package com.manager.master.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.sql.Timestamp;
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
//    private Set<GtdScheduleEntity> schedules;
//    private Set<GtdGroupEntity> groups;

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

//    @ManyToMany(mappedBy = "relatedParty")
//    public Set<GtdScheduleEntity> getSchedules() {
//        return schedules;
//    }
//
//    public void setSchedules(Set<GtdScheduleEntity> schedules) {
//        this.schedules = schedules;
//    }
//
//    @OneToMany(mappedBy = "user_groups", cascade = CascadeType.ALL)
//    @JsonIgnore
//    public Set<GtdGroupEntity> getGroups() {
//        return groups;
//    }
//
//    public void setGroups(Set<GtdGroupEntity> groups) {
//        this.groups = groups;
//    }

    /*
      private Set<GtdGroupEntity> relevance;  //与群组表，群组事件中间表成多对多关系
    private Set<GtdUserEntity> relatedParty; //与用户表，用户事件中间表成多对多关系
    //添加群组关联
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "gtd_group_schedule", schema = "gtd", joinColumns = @JoinColumn(name = "SCHEDULE_ID", referencedColumnName = "SCHEDULE_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "GROUP_ID", referencedColumnName = "GROUP_ID", nullable = false))
    public Set<GtdGroupEntity> getRelevance() {
        return relevance;
    }

    public void setRelevance(Set<GtdGroupEntity> relevance) {
        this.relevance = relevance;
    }

    //添加用户关联
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "gtd_user_shcedule", schema = "gtd", joinColumns = @JoinColumn(name = "SCHEDULE_ID", referencedColumnName = "SCHEDULE_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID", nullable = false))
    public Set<GtdUserEntity> getRelatedParty() {
        return relatedParty;
    }

    public void setRelatedParty(Set<GtdUserEntity> relatedParty) {
        this.relatedParty = relatedParty;
    }
    */
}
