package com.task.springbootrabbitmq.controller;

import com.task.springbootrabbitmq.callback.TestTaskCallbackSender;
import com.task.springbootrabbitmq.dto.TestUserTaskDto;
import com.task.springbootrabbitmq.fanout.TestTaskFanoutSender;
import com.task.springbootrabbitmq.sender.TestTaskSender1;
import com.task.springbootrabbitmq.topic.TestTaskTopicSender;
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
public class RabbitTestController {

    private final TestTaskSender1 testTaskSender1;

    private final TestTaskSender1 taskSender2;

    private final TestTaskTopicSender testTaskTopicSender;

    private final TestTaskFanoutSender testTaskFanoutSender;

    private final TestTaskCallbackSender callbackSender;

    @Autowired
    public RabbitTestController(TestTaskSender1 testTaskSender1, TestTaskSender1 taskSender2, TestTaskTopicSender testTaskTopicSender, TestTaskFanoutSender testTaskFanoutSender, TestTaskCallbackSender callbackSender) {
        this.testTaskSender1 = testTaskSender1;
        this.taskSender2 = taskSender2;
        this.testTaskTopicSender = testTaskTopicSender;
        this.testTaskFanoutSender = testTaskFanoutSender;
        this.callbackSender = callbackSender;
    }

    /**
     * 单生产者对单消费者
     * @param testUserTaskDto
     */
    @PostMapping("/task")
    public void hello(@RequestBody TestUserTaskDto testUserTaskDto) {
        String sendMsg = testUserTaskDto.getUserName() + "不想和你说话并向你发布了任务A！";
        testTaskSender1.send(sendMsg);
    }

    /**
     * 单生产者对多消费者
     * @param testUserTaskDto
     */
    @PostMapping("/oneToMany")
    public void oneToMany(@RequestBody TestUserTaskDto testUserTaskDto){
        String sendMsg = testUserTaskDto.getUserName() + "不想和你说话并向你发布了" + testUserTaskDto.getTaskName();
        for (int i = 0;i<10;i++){
            testTaskSender1.send(sendMsg + i);
        }
    }

    /**
     * 多生产者对多消费者
     * @param testUserTaskDto
     */
    @PostMapping("/manyToMany")
    public void manyToMany(@RequestBody TestUserTaskDto testUserTaskDto){
        String sendMsg = testUserTaskDto.getUserName() + "不想和你说话并向你发布了" + testUserTaskDto.getTaskName();
        for (int i = 0;i<10;i++){
            testTaskSender1.send(sendMsg + i);
            taskSender2.send(sendMsg + i);
        }
    }

    /**
     * routing_key对应binging_key
     * @param testUserTaskDto
     */
    @PostMapping("/topic")
    public void topic(@RequestBody TestUserTaskDto testUserTaskDto){
        testTaskTopicSender.send(testUserTaskDto.getTaskName(), testUserTaskDto.getTaskContent());
    }

    /**
     * 广播模式/订阅模式
     * @param testUserTaskDto
     */
    @PostMapping("/fanout")
    public void fanout(@RequestBody TestUserTaskDto testUserTaskDto) {
        testTaskFanoutSender.send(testUserTaskDto.getUserName() + "发布了" + testUserTaskDto.getTaskName());
    }

    /**
     * 回调模式
     * @param testUserTaskDto
     */
    @PostMapping(value = "/callback")
    public void callback(@RequestBody TestUserTaskDto testUserTaskDto) {
        callbackSender.send();
    }
}
