package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "gtd_label", schema = "gtd", catalog = "")
public class GtdLabelEntity {
    private int id;
    private String labelName;
    private String labelType;
    private String labelTable;

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
    public String getLabelType() {
        return labelType;
    }

    public void setLabelType(String labelType) {
        this.labelType = labelType;
    }

    @Basic
    @Column(name = "LABEL_TABLE")
    public String getLabelTable() {
        return labelTable;
    }

    public void setLabelTable(String labelTable) {
        this.labelTable = labelTable;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GtdLabelEntity that = (GtdLabelEntity) o;
        return id == that.id &&
                Objects.equals(labelName, that.labelName) &&
                Objects.equals(labelType, that.labelType) &&
                Objects.equals(labelTable, that.labelTable);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, labelName, labelType, labelTable);
    }
}
