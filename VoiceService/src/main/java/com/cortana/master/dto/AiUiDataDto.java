package com.xiaoji.master.dto;

import java.util.Map;

/**
 * MQ协议数据类
 */
public class AiUiDataDto {

    private String answer;      //讯飞应答结果

    private Map<String, Object> data;       //详情数据

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

}
