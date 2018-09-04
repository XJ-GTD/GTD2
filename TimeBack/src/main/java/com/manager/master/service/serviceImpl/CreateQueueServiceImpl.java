package com.manager.master.service.serviceImpl;

import com.manager.master.service.CreateQueueService;
import com.manager.util.CreateQueueUtil;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
@Service
@Transactional
public class CreateQueueServiceImpl implements CreateQueueService {

    @Override
    public String createQueue(RabbitTemplate rabbitTemplate, int userId, String exchangeName) throws IOException {
        //对列名
        String queueName="gtd"+userId;
        CreateQueueUtil createQueueUtil=new CreateQueueUtil();
        //创建对列
        createQueueUtil.createQueue(rabbitTemplate,queueName,exchangeName);
        return queueName;
    }
}

