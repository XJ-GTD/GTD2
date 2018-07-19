package com.manager.util;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.support.CorrelationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * 生产者工具类
 *
 * create by wzy on 2018/07/19
 */
@Component
public class ProducerUtil implements RabbitTemplate.ConfirmCallback {

    private final RabbitTemplate rabbitTemplate;
    private final AmqpTemplate amqpTemplate;


    @Autowired
    public ProducerUtil(AmqpTemplate amqpTemplate, RabbitTemplate rabbitTemplate) {
        this.amqpTemplate = amqpTemplate;
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

    /**
     * 通配符模式
     * 生产两种routing_key消息，最后会被exchange中设置的binding_key过滤，发送给对应消费者
     * @param sendMsg1
     * @param sendMsg2
     */
    public void topicSend(String sendMsg1, String sendMsg2) {
        System.out.println("topicSender1 : "+ sendMsg1);
        this.amqpTemplate.convertAndSend("exchange","topic.message",sendMsg1);

        System.out.println("topicSender2 : "+ sendMsg2);
        this.amqpTemplate.convertAndSend("exchange","topic.messages",sendMsg2);
    }

    /**
     * 订阅模式
     * @param sendMsg
     */
    public void fanoutSend(String sendMsg) {
        System.out.println(sendMsg);
        this.amqpTemplate.convertAndSend("fanoutExchange", "abcd.ee", sendMsg);
    }

    /**
     * 回调类
     */
    public void callbackSend(String sendmsg) {

        rabbitTemplate.setConfirmCallback(this);
        String msg="callbackSender : i am callback sender" + sendmsg;
        System.out.println(msg );
        CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
        System.out.println("callbackSender UUID: " + correlationData.getId());
        this.rabbitTemplate.convertAndSend("exchange", "topic.messages", msg, correlationData);
    }

    /**
     * 回调方法 回调值
     * @param correlationData
     * @param b
     * @param s
     */
    @Override
    public void confirm(CorrelationData correlationData, boolean b, String s) {
        System.out.println("callback confirm: " + correlationData.getId());
    }
}
