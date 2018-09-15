package com.manager.master.service.serviceImpl;

import com.alibaba.fastjson.JSONObject;
import com.manager.master.dto.PushInDto;
import com.manager.master.dto.PushOutDto;
import com.manager.master.repository.GroupJpaRepository;
import com.manager.master.repository.GroupRepository;
import com.manager.master.service.IWebSocketService;
import com.manager.util.ProducerUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: tzx ;
 * @Date: Created in 14:25 2018/5/8
 */
@Service
@Transactional
public class WebSocketServiceImpl implements IWebSocketService {

    private final ProducerUtil producerUtil;

    @Resource
    private GroupJpaRepository groupJpaRepository;

    @Autowired
    public WebSocketServiceImpl(ProducerUtil producerUtil) {
        this.producerUtil = producerUtil;
    }

    @Override
    public int pushToUser(PushInDto inDto) {

        //推送人ID
        Integer userId = inDto.getUserId();
        //需要推送的目标List
        List<Integer> memberUserIds = inDto.getMemberUserId();

        //需要推送的数据
        PushOutDto dataPOD = inDto.getData();
        String data = JSONObject.toJSONString(dataPOD);

        for (Integer id: memberUserIds) {
            String accountQueue = groupJpaRepository.findAccountQueue(id);
            if (accountQueue == null || "".equals(accountQueue)) {
                return 1;
            }
            producerUtil.sendTheTarget(data, accountQueue);
        }

        return 0;
    }
}
