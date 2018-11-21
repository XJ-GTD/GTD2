package com.xiaoji.aispeech.xf.aiuiData;

import java.util.ArrayList;
import java.util.List;

/**
 * 讯飞API返回json接收
 *
 * create by wzy on 2018/07/23
 */
public class AiUiResponse {

    private String code;        //结果码(具体见错误码)
    private String desc;        //描述
    private String sid;         //会话ID
    private List<AiuiSub> data = new ArrayList<AiuiSub>();  //语义结果

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getSid() {
        return sid;
    }

    public void setSid(String sid) {
        this.sid = sid;
    }


    public List<AiuiSub> getData() {
        return data;
    }

    public void setData(List<AiuiSub> data) {
        this.data = data;
    }
}
