package com.xiaoji.gtd.dto;

import java.util.List;
import java.util.Map;

/**
 * restFul返回数据
 *
 * create by wzy on 2018/11/15.
 */
public class Out {

    private RETCODE code;
    private String message;
    private BaseOut data;
    private List<BaseOut> lsData;

    public RETCODE getCode() {
        return code;
    }

    public void setCode(RETCODE code) {
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

    public void setData(BaseOut data) {
        this.data = data;
    }

    public List<BaseOut> getLsData() {
        return lsData;
    }

    public void setLsData(List<BaseOut> lsData) {
        this.lsData = lsData;
    }
}
