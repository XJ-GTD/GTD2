package com.xiaoji.gtd.dto.sync;

import java.util.List;

/**
 * 同步数据列表类
 *
 * create by wzy on 2018/12/21
 */
public class SyncDataDto {

    private String type;
    private List<SyncDataList> dataList;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<SyncDataList> getDataList() {
        return dataList;
    }

    public void setDataList(List<SyncDataList> dataList) {
        this.dataList = dataList;
    }
}
