package com.xiaoji.master.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_rule", schema = "gtd")
public class GtdRuleEntity {
    private int ruleId;
    private String ruleName;
    private String ruleComment;
    private Integer createId;
    private Timestamp createDate;
    private Integer updateId;
    private Timestamp updateDate;
    private GtdLabelEntity label;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RULE_ID")
    public int getRuleId() {
        return ruleId;
    }

    public void setRuleId(int ruleId) {
        this.ruleId = ruleId;
    }

    @Basic
    @Column(name = "RULE_NAME")
    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    @Basic
    @Column(name = "RULE_COMMENT")
    public String getRuleComment() {
        return ruleComment;
    }

    public void setRuleComment(String ruleComment) {
        this.ruleComment = ruleComment;
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
        GtdRuleEntity gtdRule = (GtdRuleEntity) o;
        return ruleId == gtdRule.ruleId &&
                Objects.equals(ruleName, gtdRule.ruleName) &&
                Objects.equals(ruleComment, gtdRule.ruleComment) &&
                Objects.equals(createId, gtdRule.createId) &&
                Objects.equals(createDate, gtdRule.createDate) &&
                Objects.equals(updateId, gtdRule.updateId) &&
                Objects.equals(updateDate, gtdRule.updateDate);
    }

    @Override
    public int hashCode() {

        return Objects.hash(ruleId, ruleName, ruleComment, createId, createDate, updateId, updateDate);
    }

    @OneToOne(mappedBy = "rule")
    @JsonIgnore
    @JSONField(serialize=false)
    public GtdLabelEntity getLabel() {
        return label;
    }

    public void setLabel(GtdLabelEntity label) {
        this.label = label;
    }

}
