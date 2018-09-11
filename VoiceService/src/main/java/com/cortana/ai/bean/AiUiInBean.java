package com.cortana.ai.bean;

/**
 * 讯飞技能实体上传数据接收类
 *
 * create by wzy on 2018/09/11
 */
public class AiUiInBean {
    private String uuid; //用户32位唯一标识码
    private String resName; //资源名，对应需要上传的资源
    private String data;    //需要上传的数据：格式 "{\"name\": \"value\", \"name\"; {\"name\": \"value\"}" + "\r\n";

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getResName() {
        return resName;
    }

    public void setResName(String resName) {
        this.resName = resName;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
