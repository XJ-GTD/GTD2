package com.task.springbootrabbitmq.receiver;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * 消费者5
 *
 * create by wzy on 2018/07/13
 */
@Component
@RabbitListener(queues = "fanout.A")
public class TestTaskFanoutReceiver5 {

    @RabbitHandler
    public void process(String hello) {
        System.out.println("topicReceiver5  : " + hello);
    }
}
