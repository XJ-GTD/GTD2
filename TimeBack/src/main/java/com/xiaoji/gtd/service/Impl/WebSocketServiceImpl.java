package com.xiaoji.gtd.service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.xiaoji.gtd.dto.mq.WebSocketOutDto;
import com.xiaoji.gtd.service.IWebSocketService;
import com.xiaoji.util.ProducerUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;


/**
 * MQ消息推送接口类
 *  *
 *  * create by wzy on 2018/11/27
 */
@Service
@Transactional
public class WebSocketServiceImpl implements IWebSocketService {

    @Resource
    private ProducerUtil producerUtil;

    /**
     * 向客户端推送数据
     * @param outDto
     */
    @Override
    public void pushMessageOfXF(String queueName, WebSocketOutDto outDto) {
        String message = JSONObject.toJSONString(outDto);
        producerUtil.send(queueName, message);
    }
}
