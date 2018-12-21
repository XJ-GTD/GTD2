package com.xiaoji.gtd.dto.sync;

import com.xiaoji.gtd.dto.BaseOut;

import java.util.List;

/**
 * 数据同步出参类
 *
 * create by wzy on 2018/12/21
 */
public class SyncOutDto extends BaseOut {

    private List<SyncDataDto> syncDataList;

    public List<SyncDataDto> getSyncDataList() {
        return syncDataList;
    }

    public void setSyncDataList(List<SyncDataDto> syncDataList) {
        this.syncDataList = syncDataList;
    }
}
