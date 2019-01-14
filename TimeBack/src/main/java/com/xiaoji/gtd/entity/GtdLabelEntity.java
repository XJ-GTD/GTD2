package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_label", schema = "gtd", catalog = "")
public class GtdLabelEntity {
    private int id;
    private String labelName;
    private String labelType;
    private String labelTable;
    private String labelColor;
    private String createId;
    private Timestamp createDate;
    private String updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "ID", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "LABEL_NAME", nullable = true, length = 10)
    public String getLabelName() {
        return labelName;
    }

    public void setLabelName(String labelName) {
        this.labelName = labelName;
    }

    @Basic
    @Column(name = "LABEL_TYPE", nullable = true, length = 5)
    public String getLabelType() {
        return labelType;
    }

    public void setLabelType(String labelType) {
        this.labelType = labelType;
    }

    @Basic
    @Column(name = "LABEL_TABLE", nullable = true, length = 20)
    public String getLabelTable() {
        return labelTable;
    }

    public void setLabelTable(String labelTable) {
        this.labelTable = labelTable;
    }

    @Basic
    @Column(name = "LABEL_COLOR", nullable = true, length = 10)
    public String getLabelColor() {
        return labelColor;
    }

    public void setLabelColor(String labelColor) {
        this.labelColor = labelColor;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GtdLabelEntity that = (GtdLabelEntity) o;
        return id == that.id &&
                Objects.equals(labelName, that.labelName) &&
                Objects.equals(labelType, that.labelType) &&
                Objects.equals(labelTable, that.labelTable) &&
                Objects.equals(labelColor, that.labelColor) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, labelName, labelType, labelTable, labelColor, createId, createDate, updateId, updateDate);
    }
}
