package com.manager.master.controller;

import com.manager.master.dto.PushInDto;
import com.manager.master.dto.ScheduleInDto;
import com.manager.util.ProducerUtil;
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

    /**
     * 推送任务日程给目标用户
     */
    @PostMapping(value = "/task")
    public void test(@RequestBody PushInDto inDto) {


    }


}
