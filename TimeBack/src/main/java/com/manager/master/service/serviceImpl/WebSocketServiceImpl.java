package com.manager.master.service.serviceImpl;

import com.manager.master.dto.PushInDto;
import com.manager.master.service.IWebSocketService;
import com.manager.util.ProducerUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @Author: tzx ;
 * @Date: Created in 14:25 2018/5/8
 */
@Service
@Transactional
public class WebSocketServiceImpl implements IWebSocketService {

    private final ProducerUtil producerUtil;

    @Autowired
    public WebSocketServiceImpl(ProducerUtil producerUtil) {
        this.producerUtil = producerUtil;
    }

    @Override
    public int pushToUser(PushInDto inDto) {

        Integer userId = inDto.getUserId();
        String data = inDto.getData();
        String target = inDto.getAccountQueue();

        producerUtil.sendTheTarget(data, target);

        return 0;
    }
}
