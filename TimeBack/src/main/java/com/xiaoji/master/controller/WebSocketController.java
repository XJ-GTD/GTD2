package com.xiaoji.master.controller;

import com.xiaoji.master.dto.PushInDto;
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
     * 反馈信息给目标用户
     */
    @PostMapping(value = "/task")
    public void test(@RequestBody PushInDto inDto) {



    }


}
