package com.manager.master.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "gtd_label", schema = "gtd")
public class GtdLabelEntity {

    private int labelId;
    private String labelName;
    @JsonIgnore
    private int labelType;
    @JsonIgnore
    private Integer createId;
    @JsonIgnore
    private Timestamp createDate;
    @JsonIgnore
    private Integer updateId;
    @JsonIgnore
    private Timestamp updateDate;

    private Set<GtdGroupEntity> group;
    private GtdRuleEntity rule;
    private GtdScheduleEntity schedule;

    @ManyToOne
    @JSONField(serialize=false)
    @JoinTable(name = "gtd_schedule_label",schema = "gtd",
            joinColumns = @JoinColumn(name = "LABEL_ID", referencedColumnName = "LABEL_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "SCHEDULE_ID", referencedColumnName = "SCHEDULE_ID", nullable = false))
    public GtdScheduleEntity getSchedule() {
        return schedule;
    }

    public void setSchedule(GtdScheduleEntity schedule) {
        this.schedule = schedule;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LABEL_ID")
    public int getLabelId() {
        return labelId;
    }

    public void setLabelId(int labelId) {
        this.labelId = labelId;
    }

    @Basic
    @Column(name = "LABEL_NAME")
    public String getLabelName() {
        return labelName;
    }

    public void setLabelName(String labelName) {
        this.labelName = labelName;
    }

    @Basic
    @Column(name = "LABEL_TYPE")
    public int getLabelType() {
        return labelType;
    }

    public void setLabelType(int labelType) {
        this.labelType = labelType;
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
        GtdLabelEntity gtdLabel = (GtdLabelEntity) o;
        return labelId == gtdLabel.labelId &&
                labelType == gtdLabel.labelType &&
                Objects.equals(labelName, gtdLabel.labelName) &&
                Objects.equals(createId, gtdLabel.createId) &&
                Objects.equals(createDate, gtdLabel.createDate) &&
                Objects.equals(updateId, gtdLabel.updateId) &&
                Objects.equals(updateDate, gtdLabel.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(labelId, labelName, labelType, createId, createDate, updateId, updateDate);
    }

    @ManyToMany(cascade=CascadeType.ALL)
    @JSONField(serialize=false)
    @JoinTable(name = "gtd_group_label", schema = "gtd",
            joinColumns = @JoinColumn(name = "LABEL_ID", referencedColumnName = "LABEL_ID"),
            inverseJoinColumns = @JoinColumn(name = "GROUP_ID", referencedColumnName = "GROUP_ID", nullable = false))
    public Set<GtdGroupEntity> getGroup() {
        return group;
    }

    public void setGroup(Set<GtdGroupEntity> group) {
        this.group = group;
    }

    @OneToOne(cascade = CascadeType.PERSIST)
    @JSONField(serialize=false)
    @JoinTable(name = "gtd_label_rule", schema = "gtd",
            joinColumns = @JoinColumn(name = "LABEL_ID", referencedColumnName = "LABEL_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "RULE_ID", referencedColumnName = "RULE_ID", nullable = false))
    public GtdRuleEntity getRule() {
        return rule;
    }

    public void setRule(GtdRuleEntity rule) {
        this.rule = rule;
    }
}
