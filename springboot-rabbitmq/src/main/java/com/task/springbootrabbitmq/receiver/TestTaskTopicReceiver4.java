package com.task.springbootrabbitmq.receiver;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * 消费者4
 *
 * create by wzy on 2018/07/13
 */
@Component
@RabbitListener(queues = "topic.messages")
public class TestTaskTopicReceiver4 {

    @RabbitHandler
    public void process(String hello) {
        System.out.println("topicReceiver4  : " + hello);
    }
}
