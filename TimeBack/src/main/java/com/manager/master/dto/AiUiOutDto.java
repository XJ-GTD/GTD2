package com.manager.master.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * 讯飞语音出参类
 *
 * create by wzy on 2018/09/14
 */
public class AiUiOutDto {

    private String dataType;        //数据类型
    private String deviceId;
    private String code;
    private String message;

    private AiUiDataDto data;

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
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

    public AiUiDataDto getData() {
        return data;
    }

    public void setData(AiUiDataDto data) {
        this.data = data;
    }
}
