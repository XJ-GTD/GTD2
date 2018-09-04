package com.manager.util;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 创建对列工具类
 */
@Component
public class CreateQueueUtil  {
    //动态创建queue
    public  void createQueue(RabbitTemplate rabbitTemplate, String queueName, String exchangeName) throws IOException {

        //创建队列
        rabbitTemplate.getConnectionFactory().createConnection().createChannel(false).queueDeclare(queueName, true, false, false, null);
        //绑定队列到对应的交换机
        rabbitTemplate.getConnectionFactory().createConnection().createChannel(false).queueBind(queueName, exchangeName, queueName);
    }


}
