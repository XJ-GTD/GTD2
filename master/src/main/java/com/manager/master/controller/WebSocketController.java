package com.manager.master.controller;

import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ServerMessageDto;
import com.manager.master.dto.ToUserMessageDto;
import com.manager.master.service.IWebSocketService;
import com.manager.util.ProducerUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


/**
 * 消息派送
 *
 * @Author: tzx ;
 * @Date: Created in 18:53 2018/5/3
 */
@RestController
@RequestMapping(value = "push")
public class WebSocketController {

    private final ProducerUtil producerUtil;

    public WebSocketController(ProducerUtil producerUtil) {
        this.producerUtil = producerUtil;
    }

    /**
     * test 稍后删除
     */
    @RequestMapping(value = "/test", method = RequestMethod.POST)
    public void test(@RequestBody ScheduleInDto inDto) {

        producerUtil.send(inDto.getScheduleName());
    }


}
