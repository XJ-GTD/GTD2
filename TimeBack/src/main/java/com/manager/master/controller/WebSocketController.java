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
import org.springframework.web.bind.annotation.*;


/**
 * 消息推送
 *
 * @Author: tzx ;
 * @Date: Create by wzy on 2018/7/27
 */
@RestController
@RequestMapping(value = "push")
public class WebSocketController {

    private final ProducerUtil producerUtil;

    public WebSocketController(ProducerUtil producerUtil) {
        this.producerUtil = producerUtil;
    }

    /**
     * 推送任务日程给目标用户
     */
    @PostMapping(value = "/task")
    public void test(@RequestBody ScheduleInDto inDto) {

        String dataMessage = inDto.toString();
        String target = inDto.getTarget();
        producerUtil.sendTheTarget(dataMessage, target);
    }


}
