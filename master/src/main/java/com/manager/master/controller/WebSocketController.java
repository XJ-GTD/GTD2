package com.manager.master.controller;

import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ServerMessageDto;
import com.manager.master.dto.ToUserMessageDto;
import com.manager.master.service.IWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;



/**
 * 消息派送
 *
 * @Author: tzx ;
 * @Date: Created in 18:53 2018/5/3
 */
@Controller
public class WebSocketController {

    @Autowired
    IWebSocketService webSocketService;

    /**
     * 广播
     * 发送给所有在线用户
     */
    @MessageMapping("/send")
    @SendTo("/topic/getResponse")//SendTo 发送至 Broker 下的指定订阅路径
    public void send2All() {
        webSocketService.sendMsg(new ServerMessageDto("欢迎您来到日程社交APP！"));
    }


    /**
     * 点对点发送
     *
     * @param toUserMsg
     * @param schedule
     */
    @MessageMapping("/cheat")
    public void cheatTo(ToUserMessageDto toUserMsg, ScheduleInDto schedule) {
        // 发送的订阅路径为/user/{userId}/message
        webSocketService.send2Users(toUserMsg, schedule);
    }
}
