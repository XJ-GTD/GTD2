package com.xiaoji.gtd.dto.mq;

/**
 * MQ消息应答数据类
 *
 * create by wzy on 2018/11/22
 */
public class WebSocketAnswer {
    private String text;
    private String url;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
