package com.xiaoji.gtd.controller;

import com.xiaoji.gtd.dto.Out;
import com.xiaoji.gtd.dto.mq.WebSocketInDto;
import com.xiaoji.gtd.dto.mq.WebSocketOutDto;
import com.xiaoji.gtd.service.IWebSocketService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.ProducerUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.io.IOException;

/**
 * 消息推送
 *
 * @Date: Create by wzy on 2018/11/21
 */
@RestController
@RequestMapping(value = "/push")
public class WebSocketController {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final IWebSocketService webSocketService;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public WebSocketController(RabbitTemplate rabbitTemplate, IWebSocketService webSocketService) {
        this.webSocketService = webSocketService;
        this.rabbitTemplate = rabbitTemplate;
    }

    /***
     * 消息数据推送
     * @return
     */
    @RequestMapping(value = "/message", method = RequestMethod.POST)
    public Out pushMessage(@RequestBody WebSocketInDto inDto) {
        Out outDto = new Out();
//        producerUtil.sendTheTarget(null, inDto.getUserId(),inDto.getExchange());
//        try {
//            BaseUtil.createQueue(rabbitTemplate, inDto.getUserId(), inDto.getFanout(), inDto.getExchange());
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        return outDto;
    }
}
