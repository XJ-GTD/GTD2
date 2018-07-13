package com.task.springbootrabbitmq.sender;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 生产者1
 * 生成的消息符合消费者对应routing_key才能被接收
 * create by wzy on 2018/07/11
 */
@Component
public class TestTaskSender1 {

    private final AmqpAdmin amqpAdmin;
    private final AmqpTemplate rabbitTemplate;

    @Autowired
    public TestTaskSender1(AmqpAdmin amqpAdmin, AmqpTemplate rabbitTemplate) {
        this.amqpAdmin = amqpAdmin;
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * routing_key: taskQueue
     * @param sendMsg
     */
    public void send(String sendMsg) {
        System.out.println("Sender1 : " + sendMsg);
        this.rabbitTemplate.convertAndSend("taskQueue", sendMsg);
    }

}
