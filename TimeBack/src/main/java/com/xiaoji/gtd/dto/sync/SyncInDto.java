package com.xiaoji.gtd.dto.sync;

import java.util.List;

/**
 * 同步数据入参类
 *
 * create by wzy on 2018/12/27
 */
public class SyncInDto {

    private String userId;
    private String deviceId;
    private String version;
    private List<SyncDataDto> syncDataList;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public List<SyncDataDto> getSyncDataList() {
        return syncDataList;
    }

    public void setSyncDataList(List<SyncDataDto> syncDataList) {
        this.syncDataList = syncDataList;
    }
}
