package com.manager.master.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

/**
 *
 * create by wzy on 2018/08/22
 */
@Entity
@Table(name = "gtd_relation", schema = "gtd", catalog = "")
public class GtdRelationEntity {
    private int relatedId;
    private String relatedName;
    private String incidenceRelation;
    private String relatedSchedule;
    private Timestamp relatedTime;
    private String relatedContact;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "RELATED_ID")
    public int getRelatedId() {
        return relatedId;
    }

    public void setRelatedId(int relatedId) {
        this.relatedId = relatedId;
    }

    @Basic
    @Column(name = "RELATED_NAME")
    public String getRelatedName() {
        return relatedName;
    }

    public void setRelatedName(String relatedName) {
        this.relatedName = relatedName;
    }

    @Basic
    @Column(name = "INCIDENCE_RELATION")
    public String getIncidenceRelation() {
        return incidenceRelation;
    }

    public void setIncidenceRelation(String incidenceRelation) {
        this.incidenceRelation = incidenceRelation;
    }

    @Basic
    @Column(name = "RELATED_SCHEDULE")
    public String getRelatedSchedule() {
        return relatedSchedule;
    }

    public void setRelatedSchedule(String relatedSchedule) {
        this.relatedSchedule = relatedSchedule;
    }

    @Basic
    @Column(name = "RELATED_TIME")
    public Timestamp getRelatedTime() {
        return relatedTime;
    }

    public void setRelatedTime(Timestamp relatedTime) {
        this.relatedTime = relatedTime;
    }

    @Basic
    @Column(name = "RELATED_CONTACT")
    public String getRelatedContact() {
        return relatedContact;
    }

    public void setRelatedContact(String relatedContact) {
        this.relatedContact = relatedContact;
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
        GtdRelationEntity that = (GtdRelationEntity) o;
        return relatedId == that.relatedId &&
                Objects.equals(relatedName, that.relatedName) &&
                Objects.equals(incidenceRelation, that.incidenceRelation) &&
                Objects.equals(relatedSchedule, that.relatedSchedule) &&
                Objects.equals(relatedTime, that.relatedTime) &&
                Objects.equals(relatedContact, that.relatedContact) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(relatedId, relatedName, incidenceRelation, relatedSchedule, relatedTime, relatedContact, createId, createDate, updateId, updateDate);
    }
}
