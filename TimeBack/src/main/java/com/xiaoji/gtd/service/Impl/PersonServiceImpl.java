package com.xiaoji.gtd.service.Impl;

import com.xiaoji.gtd.dto.*;
import com.xiaoji.gtd.dto.mq.WebSocketDataDto;
import com.xiaoji.gtd.dto.mq.WebSocketOutDto;
import com.xiaoji.gtd.dto.mq.WebSocketResultDto;
import com.xiaoji.gtd.entity.GtdAccountEntity;
import com.xiaoji.gtd.entity.GtdLoginEntity;
import com.xiaoji.gtd.entity.GtdUserEntity;
import com.xiaoji.gtd.repository.*;
import com.xiaoji.gtd.service.IPersonService;
import com.xiaoji.gtd.service.ISmsService;
import com.xiaoji.gtd.service.IWebSocketService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.TimerUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.service.spi.ServiceException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;

/**
 * 用户接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
@Transactional
public class PersonServiceImpl implements IPersonService {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Value("${person.signup.headimgurl.android}")
    private String HEAD_IMG_URL_ANDROID;
    @Value("${person.signup.headimgurl.ios}")
    private String HEAD_IMG_URL_IOS;
    @Value("${person.signup.accountStatus}")
    private String ACCOUNT_STATUS;
    @Value("${person.signup.logintype.mobile}")
    private String LOGIN_TYPE_MOBILE;
    @Value("${person.signup.logintype.account}")
    private String LOGIN_TYPE_ACCOUNT;
    @Value("${rabbitmq.exchange.type.fanout}")
    private String EXCHANGE_TYPE_FANOUT;
    @Value("${rabbitmq.exchange.type.topic}")
    private String EXCHANGE_TYPE_TOPIC;
    @Value("${mq.agreement.version}")
    private String VERSION;

    @Resource
    private PersonRepository personRepository;
    @Resource
    private GtdLoginRepository loginRepository;
    @Resource
    private GtdAccountRepository accountRepository;
    @Resource
    private GtdUserRepository userRepository;

    private final RabbitTemplate rabbitTemplate;
    private final IWebSocketService webSocketService;
    private final ISmsService smsService;

    @Autowired
    public PersonServiceImpl(RabbitTemplate rabbitTemplate, IWebSocketService webSocketService, ISmsService smsService) {
        this.rabbitTemplate = rabbitTemplate;
        this.webSocketService = webSocketService;
        this.smsService = smsService;
    }

    /**
     * 用户注册
     * @param inDto
     */
    @Override
    public int signUp(SignUpInDto inDto) {

        GtdUserEntity userEntity = new GtdUserEntity();
        GtdAccountEntity accountEntity = new GtdAccountEntity();
        GtdLoginEntity mobileLoginEntity = new GtdLoginEntity();
        GtdLoginEntity accountLoginEntity = new GtdLoginEntity();

        String accountMobile = inDto.getAccountMobile();
        String password = inDto.getPassword();
        String deviceId = inDto.getDeviceId();
        String userId = inDto.getUserId();

        String accountName = "";
        String userName = "";
        String headImg = "";
        String accountStatus = "";
        String accountInviter = "";
        String loginType = "";
        String exchangeName = "";

        try {

            Timestamp date = BaseUtil.getSqlDate();
            //规则字段
            accountName = BaseUtil.getAccountName(accountMobile);
            userName = BaseUtil.getUserName(accountMobile);
            headImg = HEAD_IMG_URL_ANDROID;
            accountStatus = ACCOUNT_STATUS;
            logger.debug("账户名：" + accountName + " 昵称：" + userName);

            //用户数据生成
            userEntity.setUserId(userId);
            userEntity.setUserName(userName);
            userEntity.setHeadImg(headImg);
            userEntity.setCreateId(userId);
            userEntity.setCreateDate(date);
            userRepository.save(userEntity);

            accountEntity.setUserId(userId);
            accountEntity.setAccountStatus(accountStatus);
            accountEntity.setAccountInviter(accountInviter);
            accountEntity.setCreateId(userId);
            accountEntity.setCreateDate(date);
            accountRepository.save(accountEntity);

            mobileLoginEntity.setLoginName(accountMobile);
            mobileLoginEntity.setUserId(userId);
            mobileLoginEntity.setPassword(password);
            loginType = LOGIN_TYPE_MOBILE;
            mobileLoginEntity.setLoginType(loginType);
            mobileLoginEntity.setCreateId(userId);
            mobileLoginEntity.setCreateDate(date);
            loginRepository.save(mobileLoginEntity);

            accountLoginEntity.setLoginName(accountName);
            accountLoginEntity.setUserId(userId);
            accountLoginEntity.setPassword(password);
            loginType = LOGIN_TYPE_ACCOUNT;
            accountLoginEntity.setLoginType(loginType);
            accountLoginEntity.setCreateId(userId);
            accountLoginEntity.setCreateDate(date);
            loginRepository.save(accountLoginEntity);

            logger.debug("用户注册成功!");
            exchangeName = BaseUtil.getExchangeName(userId);
            BaseUtil.createExchange(rabbitTemplate, exchangeName, EXCHANGE_TYPE_TOPIC);
            TimerUtil.clearOnly(accountMobile);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServiceException("服务器异常，请稍后再试！");
        }
        return 0;
    }

    /**
     * 修改密码
     * @param inDto
     * @return
     */
    @Override
    public int updatePassword(UpdatePWDInDto inDto) {

        String userId = inDto.getUserId();
        String password = inDto.getPassword();

        personRepository.updatePassword(userId, password);

        return 0;
    }

    /**
     * 查询密码是否正确
     * @param userId
     * @param password
     * @return
     */
    @Override
    public boolean isPasswordTrue(String userId, String password) {
        logger.debug("查询密码正确性：用户id " + userId + "| 密码 " + password);
        Object obj = personRepository.isPasswordTrue(userId, password);
        int count = Integer.valueOf(obj.toString());
        return count == 0;
    }

    /**
     * 发送添加邀请
     * @param inDto
     * @return
     */
    @Override
    public PlayerOutDto addPlayer(PlayerInDto inDto) {

        PlayerOutDto outDto;
        WebSocketOutDto socketOutDto;

        String accountMobile = inDto.getAccountMobile();
        String userId = inDto.getUserId();                 //用户I
        String userName = "";            //昵称
        String headImg = "";          //头像URL
        String mobile = "";

        String targetUserId = "";
        String targetUserName = "";
        String targetHeadImg = "";

        try {
            outDto = new PlayerOutDto();
            socketOutDto = new WebSocketOutDto();

            Object[] objList = (Object[]) personRepository.searchUserByMobile(accountMobile, LOGIN_TYPE_MOBILE);
            Object[] objUser = (Object[]) personRepository.searchUserById(userId);

            if (Integer.valueOf(objList[0].toString()) > 0) {
                targetUserId = String.valueOf(objList[1]);
                targetUserName = String.valueOf(objList[2]);
                targetHeadImg = String.valueOf(objList[3]);

                logger.debug("目标用户信息： " + targetUserId + " | " + targetUserName + " | " +  targetHeadImg);
                outDto.setAccountMobile(accountMobile);
                outDto.setUserId(targetUserId);
                outDto.setUserName(targetUserName);
                outDto.setHeadImg(targetHeadImg);

                userName = objUser[0].toString();
                headImg = objUser[1].toString();
                mobile = objUser[2].toString();

                logger.debug("发送邀请用户信息： " + userId + " | " + userName + " | " + headImg + " | " + mobile);
                WebSocketDataDto data = new WebSocketDataDto();
                data.setUs(userId);
                data.setUn(userName);
                data.setHi(headImg);
                data.setMb(mobile);

                socketOutDto.setRes(new WebSocketResultDto(data));
                webSocketService.pushTopicMessage(targetUserId, socketOutDto);
            } else {
                logger.debug("手机号[" + accountMobile + "]未注册!");
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            logger.error("发送邀请错误");
            throw new SecurityException("发送邀请错误");
        }
        return outDto;
    }

    /**
     * 验证手机号是否重复
     * @param mobile
     * @return
     */
    @Override
    public boolean isRepeatMobile(String mobile) {
        logger.debug("查询手机号重复性：手机号" + mobile);
        Object obj = personRepository.findByMobile(mobile);
        int count = Integer.valueOf(obj.toString());
        return count != 0;
    }

    /**
     * 验证uuid重复性
     * @param uuid
     * @return
     */
    @Override
    public boolean isRepeatUuid(String uuid) {
        logger.debug("查询uuid重复性：uuid" + uuid);
        Object obj = personRepository.findByUuid(uuid);
        int count = Integer.valueOf(obj.toString());
        return count != 0;
    }

}
