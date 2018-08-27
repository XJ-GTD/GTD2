package com.manager.master.dto;

import com.alibaba.fastjson.JSON;
import com.manager.util.ResultCode;

import java.io.Serializable;
import java.util.Map;

/**
 * create by wzy on 2018/04/26
 * 基本输出类
 */
public class BaseOutDto{
    private int code;
    // 响应消息
    private String message;
    // 响应中的数据
    private Map<String, ?> data;

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
}
