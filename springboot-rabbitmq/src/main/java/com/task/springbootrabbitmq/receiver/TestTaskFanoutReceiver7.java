package com.task.springbootrabbitmq.receiver;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * 消费者7
 *
 * create by wzy on 2018/07/13
 */
@Component
@RabbitListener(queues = "fanout.C")
public class TestTaskFanoutReceiver7 {

    @RabbitHandler
    public void process(String hello) {
        System.out.println("topicReceiver7  : " + hello);
    }

}
