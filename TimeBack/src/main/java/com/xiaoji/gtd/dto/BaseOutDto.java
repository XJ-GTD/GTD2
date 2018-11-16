package com.xiaoji.gtd.dto;

import java.util.Map;

/**
 * 基本出参类
 *
 * create by wzy on 2018/11/15.
 */
public class BaseOutDto {

    private String code;
    private String message;
    private Object data;

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

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }


}
