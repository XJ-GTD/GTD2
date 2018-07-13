package com.task.springbootrabbitmq.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 系统消息类
 *
 * create by wzy on 2018/07/13
 */
@RestController
@RequestMapping(value = "/official")
public class OfficialRabbitController {


    /**
     * 推送系统官方公告
     */
    @PostMapping("/notice")
    public void pushNotice() {
    }

    /**
     * 推送给个人用户官方信息
     */
    @PostMapping("/personal")
    public void pushPersonal() {
    }

}
