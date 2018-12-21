package com.xiaoji.gtd.dto.mq;

/**
 * MQ数据推送入参类
 *
 * create by wzy on 2018/11/29
 */
public class WebSocketInDto {

    private String userId;
    private String exchange;
    private String fanout;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public String getFanout() {
        return fanout;
    }

    public void setFanout(String fanout) {
        this.fanout = fanout;
    }
}
