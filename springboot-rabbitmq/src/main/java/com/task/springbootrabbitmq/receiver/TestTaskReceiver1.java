package com.task.springbootrabbitmq.receiver;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * 消费者1
 * 接收对应routing_key生产者生产的消息
 * create by wzy on 2018/07/11
 */
@Component
@RabbitListener(queues = "taskQueue")
public class TestTaskReceiver1 {

    @RabbitHandler
    public void process(String hello) {
        System.out.println("Receiver1  : " + hello);
    }

}
