package com.xiaoji.gtd.dto.mq;

/**
 * MQ消息业务数据类
 *
 * create by wzy on 2018/11/22
 */
public class WebSocketResultDto {
    private WebSocketDataDto data;

    public WebSocketDataDto getData() {
        return data;
    }

    public void setData(WebSocketDataDto data) {
        this.data = data;
    }
}
