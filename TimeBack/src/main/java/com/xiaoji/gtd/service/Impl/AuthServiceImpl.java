package com.xiaoji.gtd.service.Impl;

import com.xiaoji.config.rabbitmq.RabbitProducerConfig;
import com.xiaoji.gtd.dto.LoginInDto;
import com.xiaoji.gtd.dto.LoginOutDto;
import com.xiaoji.gtd.entity.GtdLoginRecordEntity;
import com.xiaoji.gtd.repository.AuthRepository;
import com.xiaoji.gtd.repository.GtdLoginRecordRepository;
import com.xiaoji.gtd.repository.PersonRepository;
import com.xiaoji.gtd.service.IAuthService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.TimerUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.IOException;
import java.sql.Timestamp;

/**
 * 验证接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
@Transactional
public class AuthServiceImpl implements IAuthService {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Value("${rabbitmq.exchange.visitors}")
    private String VISITOR_EXCHANGE_NAME;
    @Value("${person.signup.logintype.mobile}")
    private String LOGIN_TYPE_MOBILE;
    @Value("${person.signup.logintype.account}")
    private String LOGIN_TYPE_ACCOUNT;

    @Resource
    private AuthRepository authRepository;
    @Resource
    private PersonRepository personRepository;
    @Resource
    private GtdLoginRecordRepository loginRecordRepository;

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
        String deviceId = inDto.getDeviceId();
        String loginIp = inDto.getLoginIp();
        String loginLocaltion = inDto.getLoginLocaltion();
        String userId = "";
        String queueName = "";
        String token = "";

        try {
            Object[] obj = (Object[]) authRepository.passwordLogin(account, password, LOGIN_TYPE_ACCOUNT);
            int count = Integer.valueOf(obj[0].toString());
            if (count != 0) {
                userId = obj[1].toString();

                queueName = BaseUtil.getQueueName(userId, deviceId);
                BaseUtil.createQueue(rabbitTemplate, queueName, BaseUtil.getExchangeName(userId));

                token = BaseUtil.getToken(userId, deviceId);

                data.setToken(token);
                data.setUserId(userId);
                data.setAccountQueue(queueName);

                loginRecord(userId, deviceId, token, loginIp, loginLocaltion);
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
        LoginOutDto data = new LoginOutDto();
        String accountMobile = inDto.getAccount();
        String deviceId = inDto.getDeviceId();
        String loginIp = inDto.getLoginIp();
        String loginLocaltion = inDto.getLoginLocaltion();
        String userId = "";
        String queueName = "";
        String token = "";

        try {
            Object[] obj = (Object[]) authRepository.authCodeLogin(accountMobile, LOGIN_TYPE_MOBILE);
            int count = Integer.valueOf(obj[0].toString());
            if (count != 0) {

                userId = obj[1].toString();

                queueName = BaseUtil.getQueueName(userId, deviceId);
                BaseUtil.createQueue(rabbitTemplate, queueName, BaseUtil.getExchangeName(userId));

                token = BaseUtil.getToken(userId, deviceId);

                data.setUserId(userId);
                data.setAccountQueue(queueName);
                data.setToken(token);

                loginRecord(userId, deviceId, token, loginIp, loginLocaltion);
            } else {
                data = null;
            }
            TimerUtil.clearOnly(accountMobile);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return data;
    }

    /**
     * 登陆记录写入
     * @param userId
     * @param deviceId
     * @param token
     * @param loginIp
     */
    private void loginRecord(String userId, String deviceId, String token, String loginIp, String loginLocaltion) {

        GtdLoginRecordEntity lrd = new GtdLoginRecordEntity();
        Timestamp dateTime = BaseUtil.getSqlDate();

        try {
            lrd.setUserId(userId);
            lrd.setDeviceId(deviceId);
            lrd.setToken(token);
            lrd.setLoginIp(loginIp);
            lrd.setLoginLocaltion(loginLocaltion);
            lrd.setLoginTime(dateTime);
            lrd.setCreateId(userId);
            lrd.setCreateDate(dateTime);

            logger.debug("登陆记录：" + lrd.toString());
            loginRecordRepository.save(lrd);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
