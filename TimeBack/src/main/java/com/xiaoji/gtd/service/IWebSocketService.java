package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.mq.WebSocketOutDto;

/**
 * MQ消息推送接口类
 *
 * create by wzy on 2018/11/27
 */
public interface IWebSocketService {

    /**
     * 向客户端推送数据
     * @param outDto
     */
    void pushMessage(String queueName, WebSocketOutDto outDto);
}
