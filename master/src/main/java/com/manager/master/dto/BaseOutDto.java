package com.manager.master.dto;

import java.util.Map;

/**
 * create by wzy on 2018/04/26
 * 基本输出类
 */
public class BaseOutDto {
    private String message;
    private String code;
    private Map<String, ?> data;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Map<String, ?> getData() {
        return data;
    }

    public void setData(Map<String, ?> data) {
        this.data = data;
    }
}
