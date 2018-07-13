package com.task.springbootrabbitmq.receiver;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * 消费者3
 *
 * create by wzy on 2018/07/13
 */
@Component
@RabbitListener(queues = "topic.message")
public class TestTaskTopicReceiver3 {

    @RabbitHandler
    public void process(String hello) {
        System.out.println("topicReceiver3  : " + hello);
    }

}
