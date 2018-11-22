package com.xiaoji.gtd.dto.mq;

import java.util.List;
import java.util.Map;

/**
 * MQ消息业务数据类
 *
 * create by wzy on 2018/11/22
 */
public class WebSocketResult {
    private WebSocketData data;

    public WebSocketData getData() {
        return data;
    }

    public void setData(WebSocketData data) {
        this.data = data;
    }
}
