package com.xiaoji.gtd.dto.sync;

/**
 * 数据列表类
 *
 * create by wzy on 2018/12/21
 */
public class SyncInitData {

    private long id;          //自增主键
    private String key;
    private String value;
    private String type;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
