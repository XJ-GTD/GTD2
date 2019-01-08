package com.xiaoji.gtd.dto.sync;

import com.xiaoji.gtd.dto.BaseOut;

import java.util.List;

/**
 * 数据同步出参类
 *
 * create by wzy on 2018/12/21
 */
public class SyncOutDto extends BaseOut {

    private String version;
    private List<SyncInitDataDto> syncDataList;
    private List<SyncDataDto> userDataList;

    public List<SyncInitDataDto> getSyncDataList() {
        return syncDataList;
    }

    public void setSyncDataList(List<SyncInitDataDto> syncDataList) {
        this.syncDataList = syncDataList;
    }

    public List<SyncDataDto> getUserDataList() {
        return userDataList;
    }

    public void setUserDataList(List<SyncDataDto> userDataList) {
        this.userDataList = userDataList;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
