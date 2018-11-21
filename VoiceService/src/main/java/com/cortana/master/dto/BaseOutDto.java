package com.xiaoji.master.dto;

import com.alibaba.fastjson.JSON;
import com.xiaoji.gtd.dto.code.ResultCode;

import java.util.Map;

/**
 * create by wzy on 2018/04/26
 * 基本输出类
 */
public class BaseOutDto{
    private int code;           //响应状态值
    private String message;     // 响应消息
    private Map<String, ?> data;        // 响应的数据
    private String speech;      //讯飞语音播报字段

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Map<String, ?> getData() {
        return data;
    }

    public void setData(Map<String, ?> data) {
        this.data = data;
    }


    public BaseOutDto setCode(ResultCode resultCode){
        this.code = resultCode.code;
        return this;
    }

    @Override
    public String toString() {
        return JSON.toJSONString(this);
    }

    public String getSpeech() {
        return speech;
    }

    public void setSpeech(String speech) {
        this.speech = speech;
    }
}
