package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_sync_version", schema = "gtd", catalog = "")
public class GtdSyncVersionEntity {
    private long id;
    private String userId;
    private String version;
    private String tableName;
    private String tableId;
    private String deviceId;
    private String syncAction;
    private String createId;
    private Timestamp createDate;
    private String updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "ID", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Basic
    @Column(name = "USER_ID", nullable = true, length = 50)
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "VERSION", nullable = true, length = 50)
    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    @Basic
    @Column(name = "TABLE_NAME", nullable = true, length = 50)
    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    @Basic
    @Column(name = "TABLE_ID", nullable = true, length = 50)
    public String getTableId() {
        return tableId;
    }

    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    @Basic
    @Column(name = "DEVICE_ID", nullable = true, length = 100)
    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    @Basic
    @Column(name = "SYNC_ACTION", nullable = true, length = 20)
    public String getSyncAction() {
        return syncAction;
    }

    public void setSyncAction(String syncAction) {
        this.syncAction = syncAction;
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
        GtdSyncVersionEntity that = (GtdSyncVersionEntity) o;
        return id == that.id &&
                Objects.equals(userId, that.userId) &&
                Objects.equals(version, that.version) &&
                Objects.equals(tableName, that.tableName) &&
                Objects.equals(tableId, that.tableId) &&
                Objects.equals(deviceId, that.deviceId) &&
                Objects.equals(syncAction, that.syncAction) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, version, tableName, tableId, deviceId, syncAction, createId, createDate, updateId, updateDate);
    }
}
