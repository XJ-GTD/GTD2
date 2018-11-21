//package com.xiaoji.master.service.serviceImpl;
//
//import com.xiaoji.master.service.ICreateQueueService;
//import com.xiaoji.util.BaseUtil;
//import com.xiaoji.util.CreateQueueUtil;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.io.IOException;
//@Service
//@Transactional
//public class CreateQueueServiceImpl implements ICreateQueueService {
//
//    private static String TOPIC_EXCHANGE = "topic";
//    private static String FANOUT_EXCHANGE = "fanout";
//
//    @Autowired
//    RabbitTemplate rabbitTemplate;
//
//    @Override
//    public String createQueue(int userId, String deviceId, String exchange) throws IOException {
//        //对列名
//        String queueName = BaseUtil.createQueueName(userId, deviceId);
//        CreateQueueUtil createQueueUtil = new CreateQueueUtil();
//
//        String exchangeName = BaseUtil.createExchangeName(userId);
//        //创建对列
//        createQueueUtil.createQueue(rabbitTemplate, queueName, exchangeName);
//        return queueName;
//    }
//
//    @Override
//    public String createExchange(int userId, int type) throws IOException {
//        //对列名
//        String exchangeName = BaseUtil.createExchangeName(userId);
//        CreateQueueUtil createQueueUtil = new CreateQueueUtil();
//        createQueueUtil.createExchange(rabbitTemplate, exchangeName, TOPIC_EXCHANGE);
//        return exchangeName;
//    }
//}
//
