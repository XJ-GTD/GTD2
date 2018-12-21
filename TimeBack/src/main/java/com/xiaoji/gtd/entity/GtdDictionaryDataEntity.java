package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_dictionary_data", schema = "gtd", catalog = "")
public class GtdDictionaryDataEntity {
    private long id;
    private int dictValue;
    private String dictdataName;
    private String dictdataValue;
    private String createId;
    private Timestamp createDate;
    private String updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Basic
    @Column(name = "DICT_VALUE")
    public int getDictValue() {
        return dictValue;
    }

    public void setDictValue(int dictValue) {
        this.dictValue = dictValue;
    }

    @Basic
    @Column(name = "DICTDATA_NAME")
    public String getDictdataName() {
        return dictdataName;
    }

    public void setDictdataName(String dictdataName) {
        this.dictdataName = dictdataName;
    }

    @Basic
    @Column(name = "DICTDATA_VALUE")
    public String getDictdataValue() {
        return dictdataValue;
    }

    public void setDictdataValue(String dictdataValue) {
        this.dictdataValue = dictdataValue;
    }

    @Basic
    @Column(name = "CREATE_ID")
    public String getCreateId() {
        return createId;
    }

    public void setCreateId(String createId) {
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
    public String getUpdateId() {
        return updateId;
    }

    public void setUpdateId(String updateId) {
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
        GtdDictionaryDataEntity that = (GtdDictionaryDataEntity) o;
        return id == that.id &&
                dictValue == that.dictValue &&
                Objects.equals(dictdataName, that.dictdataName) &&
                Objects.equals(dictdataValue, that.dictdataValue) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, dictValue, dictdataName, dictdataValue, createId, createDate, updateId, updateDate);
    }
}
