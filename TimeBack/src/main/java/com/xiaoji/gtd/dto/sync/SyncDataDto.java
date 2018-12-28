package com.xiaoji.gtd.dto.sync;

import java.util.List;

/**
 * 用户同步数据类
 *
 * create by wzy on 2018/12/27
 */
public class SyncDataDto {

    private String tableName;
    private List<SyncTableData> dataList;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }


    public List<SyncTableData> getDataList() {
        return dataList;
    }

    public void setDataList(List<SyncTableData> dataList) {
        this.dataList = dataList;
    }
}
