package com.task.springbootrabbitmq.callback;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.support.CorrelationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * 回调类生产者
 *
 * create by wzy on 2018/07/13
 */
@Component
public class TestTaskCallbackSender implements RabbitTemplate.ConfirmCallback {

    @Autowired
    private RabbitTemplate rabbitTemplateNew;
    public void send() {

        rabbitTemplateNew.setConfirmCallback(this);
        String msg="callbackSender : i am callback sender";
        System.out.println(msg );
        CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
        System.out.println("callbackSender UUID: " + correlationData.getId());
        this.rabbitTemplateNew.convertAndSend("exchange", "topic.messages", msg, correlationData);
    }

    @Override
    public void confirm(CorrelationData correlationData, boolean b, String s) {
        System.out.println("callback confirm: " + correlationData.getId());
    }
}
