package com.task.springbootrabbitmq.sender;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 生产者2
 *
 * create by wzy on 2018/07/12
 */
@Component
public class TestTaskSender2 {

    private final AmqpTemplate rabbitTemplate;

    @Autowired
    public TestTaskSender2(AmqpTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void send(String sendMsg) {
        System.out.println("Sender2 : " + sendMsg);
        this.rabbitTemplate.convertAndSend("taskQueue", sendMsg);
    }
}
