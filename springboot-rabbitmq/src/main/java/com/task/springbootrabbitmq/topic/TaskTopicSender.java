package com.task.springbootrabbitmq.topic;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 生产者Topic
 * 生产消息的routing_key符合消费者对应的exchange中binding_key才能被接收
 * create by wzy on 2018/07/12
 */
@Component
public class TaskTopicSender {

    private final AmqpTemplate amqpTemplate;

    @Autowired
    public TaskTopicSender(AmqpTemplate amqpTemplate) {
        this.amqpTemplate = amqpTemplate;
    }

    /**
     * 生产两种routing_key消息，最后会被exchange中设置的binding_key过滤，发送给对应消费者
     * @param sendMsg1
     * @param sendMsg2
     */
    public void send(String sendMsg1, String sendMsg2) {
        System.out.println("sender1 : "+ sendMsg1);
        this.amqpTemplate.convertAndSend("exchange","topic.message",sendMsg1);

        System.out.println("sender2 : "+ sendMsg2);
        this.amqpTemplate.convertAndSend("exchange","topic.messages",sendMsg2);
    }
}
