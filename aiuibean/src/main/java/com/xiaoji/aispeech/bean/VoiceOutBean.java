package com.xiaoji.aispeech.bean;

import com.xiaoji.aispeech.xf.aiuiData.Slot;

import java.util.List;

/**
 * 返回数据
 *
 * create by wzy on 2018/07/23
 */
public class VoiceOutBean {
    private String code;
    private String message;
    private String deviceId;
    private String userId;
    private List<NlpOutDto> data;

    @Override
    public String toString() {
        return "VoiceOutBean{" +
                "code='" + code + '\'' +
                ", message='" + message + '\'' +
                ", deviceId='" + deviceId + '\'' +
                ", userId='" + userId + '\'' +
                ", data=" + data +
                '}';
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<NlpOutDto> getData() {
        return data;
    }

    public void setData(List<NlpOutDto> data) {
        this.data = data;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
}


