package com.task.springbootrabbitmq.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 任务日程类
 *
 * create by wzy on 2018/07/13
 */
@RestController
@RequestMapping(value = "/task")
public class TaskRabbitController {


    /**
     * 发布用户发布任务
     */
    @PostMapping("/issue")
    public void issueSchedule() {
    }

    /**
     * 执行更新任务状态
     */
    @PostMapping("/status")
    public void statusSchedule() {
    }

    /**
     * 发布人修改任务
     */
    @PostMapping("/update")
    public void updateSchedule() {
    }

    /**
     * 发布人催促执行人
     */
    @PostMapping("/press")
    public void pressSchedule() {
    }

}
