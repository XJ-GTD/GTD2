package com.manager.master.dto;

import java.util.Date;
import java.util.Map;

/**
 * 群组
 * create  zy
 */
public class GroupOutDto{

    private int code;
    // 响应消息
    private String message;
    //
    private String speech;
    // 响应中的数据
    private Map<String, Object> data;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSpeech() {
        return speech;
    }

    public void setSpeech(String speech) {
        this.speech = speech;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }


    @Override
    public String toString() {
        return "GroupOutDto{" +
                "code=" + code +
                ", message='" + message + '\'' +
                ", speech='" + speech + '\'' +
                ", data=" + data +
                '}';
    }
}
