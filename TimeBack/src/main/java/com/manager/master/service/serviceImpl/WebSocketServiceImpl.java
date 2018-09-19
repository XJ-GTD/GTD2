package com.manager.master.service.serviceImpl;

import com.alibaba.fastjson.JSONObject;
import com.manager.master.dto.PushInDto;
import com.manager.master.dto.PushOutDto;
import com.manager.master.repository.UserJpaRepository;
import com.manager.master.service.IWebSocketService;
import com.manager.util.ProducerUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

import static org.apache.logging.log4j.Level.ERROR;

/**
 * @Author: tzx ;
 * @Date: Created in 14:25 2018/5/8
 */
@Service
@Transactional
public class WebSocketServiceImpl implements IWebSocketService {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final ProducerUtil producerUtil;

    @Resource
    private UserJpaRepository userJpaRepository;

    @Autowired
    public WebSocketServiceImpl(ProducerUtil producerUtil) {
        this.producerUtil = producerUtil;
    }

    /**
     * 推送消息至目标用户
     * @param inDto
     * @return
     */
    @Override
    public int pushToUser(PushInDto inDto) {

        //推送人ID
        Integer userId = inDto.getUserId();
        //需要推送的目标List
        List<Integer> memberUserIds = inDto.getMemberUserId();
        Integer targetUserId = inDto.getTargetUserId();

        if ((memberUserIds == null || memberUserIds.size() == 0)
                && (targetUserId == null || targetUserId == 0)){
            logger.log(ERROR,"缺少目标用户ID");
            throw new SecurityException("缺少目标用户ID");
        }

        //需要推送的数据
        PushOutDto dataPOD = inDto.getData();
        String data = JSONObject.toJSONString(dataPOD);

        String accountQueue = "";

        if (memberUserIds != null && memberUserIds.size() != 0) {
            for (Integer id: memberUserIds) {
                accountQueue = userJpaRepository.findAccountQueue(id);
                if (accountQueue == null || "".equals(accountQueue)) {
                    return 1;
                }
                producerUtil.sendTheTarget(data, accountQueue);
            }
        } else if (targetUserId != null && targetUserId != 0) {
            accountQueue = userJpaRepository.findAccountQueue(targetUserId);
            if (accountQueue == null || "".equals(accountQueue)) {
                return 1;
            }
            producerUtil.sendTheTarget(data, accountQueue);
        }

        return 0;
    }
}
