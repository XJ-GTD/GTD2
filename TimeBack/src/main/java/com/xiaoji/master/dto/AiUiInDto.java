package com.xiaoji.master.dto;

/**
 * 讯飞语音入参类
 *
 * create by wzy on 2018/09/14
 */
public class AiUiInDto {
    private String content;         //base64转码语音文件  /  文本
    private String userId;
    private String deviceId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

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
}
