package com.task.springbootrabbitmq.controller;

import com.task.springbootrabbitmq.dto.UserTaskDto;
import com.task.springbootrabbitmq.sender.TaskSender1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 控制器
 *
 * create by wzy on 2018/07/11
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/rabbit")
public class RabbitController {

    private final TaskSender1 taskSender1;

    private final TaskSender1 taskSender2;

    @Autowired
    public RabbitController(TaskSender1 taskSender1, TaskSender1 taskSender2) {
        this.taskSender1 = taskSender1;
        this.taskSender2 = taskSender2;
    }

    @PostMapping("/task")
    public void hello(@RequestBody UserTaskDto userTaskDto) {
        String sendMsg = userTaskDto.getUserName() + "不想和你说话并向你发布了任务A！";
        taskSender1.send(sendMsg);
    }

    @PostMapping("/oneToMany")
    public void oneToMany(@RequestBody UserTaskDto userTaskDto){
        String sendMsg = userTaskDto.getUserName() + "不想和你说话并向你发布了" + userTaskDto.getTaskName();
        for (int i = 0;i<10;i++){
            taskSender1.send(sendMsg + i);
        }
    }

    @PostMapping("/manyToMany")
    public void manyToMany(@RequestBody UserTaskDto userTaskDto){
        String sendMsg = userTaskDto.getUserName() + "不想和你说话并向你发布了" + userTaskDto.getTaskName();
        for (int i = 0;i<10;i++){
            taskSender1.send(sendMsg + i);
            taskSender2.send(sendMsg + i);
        }
    }


}
