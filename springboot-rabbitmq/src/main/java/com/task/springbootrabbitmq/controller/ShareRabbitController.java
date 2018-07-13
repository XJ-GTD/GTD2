package com.task.springbootrabbitmq.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户分享类
 *
 * create by wzy on 2018/07/13
 */
@RestController
@RequestMapping(value = "/share")
public class ShareRabbitController {


    /**
     * 用户分享日程
     */
    @PostMapping("/schedule")
    public void shareSchedule() {
    }

    /**
     * 用户分享纪念日
     */
    @PostMapping("/memorial")
    public void shareMemorial() {
    }

    /**
     * 用户分享记事
     */
    @PostMapping("/note")
    public void shareNote() {
    }

    /**
     * 用户分享APP应用
     */
    @PostMapping("/app")
    public void shareApp() {
    }


}
