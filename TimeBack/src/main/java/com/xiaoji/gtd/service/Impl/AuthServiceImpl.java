package com.xiaoji.gtd.service.Impl;

import com.xiaoji.config.rabbitmq.RabbitProducerConfig;
import com.xiaoji.gtd.dto.LoginInDto;
import com.xiaoji.gtd.dto.LoginOutDto;
import com.xiaoji.gtd.repository.AuthRepository;
import com.xiaoji.gtd.repository.PersonRepository;
import com.xiaoji.gtd.service.IAuthService;
import com.xiaoji.util.BaseUtil;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.IOException;

/**
 * 验证接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
@Transactional
public class AuthServiceImpl implements IAuthService {

    @Value("${rabbitmq.exchange.visitors}")
    private String VISITOR_EXCHANGE_NAME;

    @Resource
    private AuthRepository authRepository;
    @Resource
    private PersonRepository personRepository;

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public AuthServiceImpl(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * 游客验证
     * @return
     */
    @Override
    public String visitorsLogin(LoginInDto inDto) {
        String accountQueue = "";
        try {
            accountQueue = BaseUtil.getQueueName(inDto.getUserId(), inDto.getDeviceId());
            BaseUtil.createQueue(rabbitTemplate, accountQueue, VISITOR_EXCHANGE_NAME);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return accountQueue;
    }

    /**
     * 密码登陆验证
     * @return
     */
    @Override
    public LoginOutDto passwordLogin(LoginInDto inDto) {
        LoginOutDto data = new LoginOutDto();
        String account = inDto.getAccount();
        String password = inDto.getPassword();
        String queueName = "";

        try {
            Object[] obj = (Object[]) authRepository.passwordLogin(account, password);
            int count = Integer.valueOf(obj[0].toString());
            if (count != 0) {
                data.setUserId(obj[1].toString());
                queueName = BaseUtil.getQueueName(data.getUserId(), inDto.getDeviceId());
                BaseUtil.createQueue(rabbitTemplate, queueName, BaseUtil.getExchangeName(data.getUserId()));
                data.setAccountQueue(queueName);
            } else {
                data = null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return data;
    }

    /**
     * 短信登陆验证
     * @return
     */
    @Override
    public LoginOutDto smsLogin(LoginInDto inDto) {
        return null;
    }
}
