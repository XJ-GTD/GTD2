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
    @Value("${rabbitmq.exchange.system}")
    private String SYSTEM_EXCHANGE_NAME;
    @Value("${person.signup.logintype.mobile}")
    private String LOGIN_TYPE_MOBILE;
    @Value("${person.signup.logintype.account}")
    private String LOGIN_TYPE_ACCOUNT;
    @Value("${person.signup.authtype.visitor}")
    private String AUTH_TYPE_VISITOR;
    @Value("${person.signup.authtype.user}")
    private String AUTH_TYPE_USER;

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
    public LoginOutDto visitorsLogin(LoginInDto inDto) {
        LoginOutDto data = null;
        try {
            String deviceId = inDto.getDeviceId();
            String loginIp = inDto.getLoginIp();
            String loginLocaltion = inDto.getLoginLocaltion();
            String accountQueue = "";
            String userId = "";
            String token = "";

            token = BaseUtil.getToken(userId, deviceId, AUTH_TYPE_VISITOR);
            accountQueue = BaseUtil.getQueueName(inDto.getUserId(), inDto.getDeviceId());
            BaseUtil.visitorCreateQueue(rabbitTemplate, accountQueue, VISITOR_EXCHANGE_NAME);

            data = new LoginOutDto();
            data.setAccountQueue(accountQueue);
            data.setToken(token);

            loginRecord(userId, deviceId, token, loginIp, loginLocaltion);
        } catch (IOException e) {
            e.printStackTrace();
            logger.error("游客登陆出错");
        }
        return data;
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
        String userName = "";
        String headImg = "";
        String birthday = "";
        String realName = "";
        String idCard = "";
        String userSex = "";

        try {
            Object[] obj = (Object[]) authRepository.authLogin(account, password);
            int count = Integer.valueOf(obj[0].toString());
            if (count != 0) {
                if (obj[1] != null)userId = obj[1].toString();
                if (obj[2] != null)userName = obj[2].toString();
                if (obj[3] != null)headImg = obj[3].toString();
                if (obj[4] != null)birthday = obj[4].toString();
                if (obj[5] != null)realName = obj[5].toString();
                if (obj[6] != null)idCard = obj[6].toString();
                if (obj[7] != null)userSex = obj[7].toString();

                queueName = BaseUtil.getQueueName(userId, deviceId);
                BaseUtil.createQueue(rabbitTemplate, userId, deviceId, BaseUtil.getExchangeName(userId));
                BaseUtil.bindExchange(rabbitTemplate, queueName, SYSTEM_EXCHANGE_NAME);

                token = BaseUtil.getToken(userId, deviceId, AUTH_TYPE_USER);

                data.setToken(token);
                data.setAccountQueue(queueName);
                data.setUserId(userId);
                data.setUserName(userName);
                data.setBirthday(birthday);
                data.setHeadImg(headImg);
                data.setRealName(realName);
                data.setIdCard(idCard);
                data.setUserSex(userSex);

                loginRecord(userId, deviceId, token, loginIp, loginLocaltion);
            } else {
                data = null;
            }
        } catch (NullPointerException ne) {
            ne.printStackTrace();
            logger.error("数据读取异常");
            throw new SecurityException("数据读取异常");
        } catch (IOException ie) {
            ie.printStackTrace();
            logger.error("io异常:" + ie.getMessage());
            throw new SecurityException("交换机获取异常");
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
        String account = inDto.getAccount();
        String deviceId = inDto.getDeviceId();
        String loginIp = inDto.getLoginIp();
        String loginLocaltion = inDto.getLoginLocaltion();
        String userId = "";
        String queueName = "";
        String token = "";
        String userName = "";
        String headImg = "";
        String birthday = "";
        String realName = "";
        String idCard = "";
        String userSex = "";

        try {
            Object[] obj = (Object[]) authRepository.authLogin(account, null);
            int count = Integer.valueOf(obj[0].toString());
            if (count != 0) {

                if (obj[1] != null)userId = obj[1].toString();
                if (obj[2] != null)userName = obj[2].toString();
                if (obj[3] != null)headImg = obj[3].toString();
                if (obj[4] != null)birthday = obj[4].toString();
                if (obj[5] != null)realName = obj[5].toString();
                if (obj[6] != null)idCard = obj[6].toString();
                if (obj[7] != null)userSex = obj[7].toString();

                queueName = BaseUtil.getQueueName(userId, deviceId);
                BaseUtil.createQueue(rabbitTemplate, userId, deviceId, BaseUtil.getExchangeName(userId));
                BaseUtil.bindExchange(rabbitTemplate, queueName, SYSTEM_EXCHANGE_NAME);

                token = BaseUtil.getToken(userId, deviceId, AUTH_TYPE_USER);

                data.setUserId(userId);
                data.setUserName(userName);
                data.setBirthday(birthday);
                data.setHeadImg(headImg);
                data.setUserSex(userSex);
                data.setRealName(realName);
                data.setIdCard(idCard);

                data.setAccountQueue(queueName);
                data.setToken(token);

                loginRecord(userId, deviceId, token, loginIp, loginLocaltion);
            } else {
                data = null;
            }
            TimerUtil.clearOnly(account);
        } catch (NullPointerException ne) {
            ne.printStackTrace();
            logger.error("数据读取异常");
            throw new SecurityException("数据读取异常");
        } catch (IOException ie) {
            ie.printStackTrace();
            logger.error("io异常:" + ie.getMessage());
            throw new SecurityException("交换机获取异常");
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
            logger.error("登陆记录异常:" + e.getMessage());
        }

    }
}
