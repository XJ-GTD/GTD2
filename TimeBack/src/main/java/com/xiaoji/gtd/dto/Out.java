package com.xiaoji.gtd.dto;

import com.xiaoji.gtd.dto.code.ResultCode;

import java.util.List;

/**
 * restFul返回数据
 *
 * create by wzy on 2018/11/15.
 */
public class Out {

    private int code;
    private String message;
    private BaseOut data;
    private List<BaseOut> lsData;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<BaseOut> getLsData() {
        return lsData;
    }

    public void setLsData(List<BaseOut> lsData) {
        this.lsData = lsData;
    }

    public BaseOut getData() {
        return data;
    }

    public void setData(BaseOut data) {
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public void setCode(ResultCode code) {
        this.code = code.code;
    }

}
