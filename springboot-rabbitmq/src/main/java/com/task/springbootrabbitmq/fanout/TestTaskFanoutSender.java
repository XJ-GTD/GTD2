package com.task.springbootrabbitmq.fanout;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 生产者Fanout
 * 广播模式/订阅模式
 * create by wzy on 2018/07/12
 */
@Component
public class TestTaskFanoutSender {

    private final AmqpTemplate amqpTemplate;

    @Autowired
    public TestTaskFanoutSender(AmqpTemplate amqpTemplate) {
        this.amqpTemplate = amqpTemplate;
    }

    public void send(String sendMsg) {
        System.out.println(sendMsg);
        this.amqpTemplate.convertAndSend("fanoutExchange", "abcd.ee", sendMsg);
    }
}
