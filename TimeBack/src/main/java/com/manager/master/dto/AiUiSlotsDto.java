package com.manager.master.dto;

/**
 * 讯飞语音json数据语料参数类
 *
 * create by wzy on 2018/11/1
 */
public class AiUiSlotsDto {

    private String name;        //槽位名
    private String normValue;   //槽位解析值
    private String value;       //槽位值

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNormValue() {
        return normValue;
    }

    public void setNormValue(String normValue) {
        this.normValue = normValue;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

}
