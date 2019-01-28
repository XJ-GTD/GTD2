package com.xiaoji.gtd.service.Impl;

import com.xiaoji.gtd.dto.*;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.dto.mq.WebSocketDataDto;
import com.xiaoji.gtd.dto.mq.WebSocketOutDto;
import com.xiaoji.gtd.dto.mq.WebSocketResultDto;
import com.xiaoji.gtd.dto.mq.WebSocketSkillEnum;
import com.xiaoji.gtd.dto.player.*;
import com.xiaoji.gtd.entity.GtdAccountEntity;
import com.xiaoji.gtd.entity.GtdLoginEntity;
import com.xiaoji.gtd.entity.GtdUserEntity;
import com.xiaoji.gtd.repository.*;
import com.xiaoji.gtd.service.IPersonService;
import com.xiaoji.gtd.service.ISmsService;
import com.xiaoji.gtd.service.IWebSocketService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.CommonMethods;
import com.xiaoji.util.Pinyin4j;
import com.xiaoji.util.TimerUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.service.spi.ServiceException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * 用户接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
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
    @Resource
    private GtdPlayerRepository playerRepository;
    @Resource
    private GtdPersonRepository gtdPersonRepository;
    @Resource
    private AuthRepository authRepository;

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
    @Transactional
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
    @Transactional
    @Override
    public int updatePassword(UpdatePWDInDto inDto) {

        String userId = inDto.getUserId();
        String password = inDto.getPassword();

        personRepository.updatePassword(userId, password);

        return 0;
    }

    /**
     * 用户信息修改
     *
     * @param inDto
     * @return
     */
    @Override
    @Transactional
    public int updateUserInfo(UserInfoInDto inDto) {
        GtdUserEntity userEntity = new GtdUserEntity();
        int flag = 0;
        try {
            userEntity.setUserId(inDto.getUserId());
            userEntity.setUserName(inDto.getUserName());
            userEntity.setHeadImg(inDto.getHeadImgUrl());
            userEntity.setUserSex(inDto.getUserSex());
            userEntity.setBirthday(inDto.getBirthday());
            userEntity.setRealName(inDto.getRealName());
            userEntity.setIdCard(inDto.getIdCard());

            userRepository.save(userEntity);
            logger.debug("用户["+ inDto.getUserId() + "] 更新信息数据成功");
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("用户["+ inDto.getUserId() + "] 更新信息数据失败");
            flag = 1;
        }
        return flag;
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
    public int addPlayer(PlayerInDto inDto) {

        WebSocketOutDto pushDto;
        PlayerDataDto data;

        List<PlayerInData> playerList = inDto.getPlayerList();
        String userId = inDto.getUserId();                 //用户Id
        String targetUserId = "";       //目标用户ID
        String targetMobile = "";       //目标用户手机号

        String userName = "";           //昵称
        String headImg = "";            //头像URL
        String mobile = "";             //手机号


        try {
            pushDto = new WebSocketOutDto();

            for (PlayerInData pid : playerList) {

                targetMobile = pid.getTargetMobile();
                targetUserId = pid.getTargetUserId();
                if (targetUserId != null && !targetUserId.equals("") && targetUserId.equals(userId)) {
                    logger.debug("[不能添加自己为好友]");
                    continue;
                }

                data = searchRelation(userId, targetUserId, targetMobile);

                if (data.isAgree() && data.isPlayer()) {
                    logger.debug("[已经成为对方好友]:无需重复太添加");
                    return 2;
                } else if (!data.isPlayer() && data.isUser()){
                    Object[] objUser = (Object[]) personRepository.searchUserById(userId);
                    if (targetUserId != null && !targetUserId.equals("")) {

                        userName = objUser[0].toString();
                        headImg = objUser[1].toString();
                        mobile = objUser[2].toString();
                        logger.debug("发送邀请用户信息： " + userId + " | " + userName + " | " + headImg + " | " + mobile);

                        WebSocketDataDto socketData = new WebSocketDataDto();
                        socketData.setUs(userId);
                        socketData.setUn(userName);
                        socketData.setHi(headImg);
                        socketData.setMb(mobile);
                        socketData.setIa(true);

                        pushDto.setSk(WebSocketSkillEnum.getIntentCode("player_create"));
                        pushDto.setVs(VERSION);
                        pushDto.setSs(ResultCode.SUCCESS);
                        pushDto.setRes(new WebSocketResultDto(socketData));
                        webSocketService.pushTopicMessage(targetUserId, pushDto);
                        logger.debug("[成功推送邀请]:方式 === rabbitmq | targetUserId:" + targetUserId);
                    }

                } else if (!data.isUser()) {
                    logger.debug("手机号[" + targetMobile + "]未注册! | 已通过短信推送邀请");
                    //短信推送邀请
                    smsService.pushPlayer(targetMobile);
                } else if (!data.isAgree() && data.isPlayer()){
                    logger.debug("[已经被对方" + targetUserId + "拉黑]:无法发送邀请");
                    return 1;
                } else {
                    //可能出错
                    logger.debug("addPlayer数据出错");
                    return -1;
                }

            }

        } catch (Exception e) {
            e.printStackTrace();
            logger.error("发送邀请错误");
        }
        return 0;
    }

    /**
     * 查询联系人
     *
     * @param inDto
     * @return
     */
    @Override
    public PlayerOutDto searchPlayer(PlayerInDto inDto) {

        PlayerOutDto outDto = new PlayerOutDto();
        List<PlayerOutData> dataList = new ArrayList<>();
        PlayerOutData data;

        List<PlayerInData> playerList = inDto.getPlayerList();

        List<String> mobileList = new ArrayList<>();
        String userName = "";
        String headImg = "";
        String userId = "";
        String pyOfUserName = "";
        String accountMobile = "";

        try {
            for (PlayerInData pid: playerList) {
                if(!CommonMethods.isInteger(pid.getTargetMobile())){
                    logger.debug("[查询用户失败]：请输入正确手机号");
                    return null;
                }
                if(pid.getTargetMobile().length() != 11){
                    logger.debug("[查询用户失败]：请输入正确手机号");
                    return null;
                }
                mobileList.add(pid.getTargetMobile());
            }
            logger.debug("-------- 本次需要查询用户数据 手机号码数量为 " + mobileList.size() + " ------------");
            List<Object> objList = gtdPersonRepository.searchUserByMobile(mobileList, LOGIN_TYPE_MOBILE);
            if (objList.size() > 0) {
                logger.debug("-------- 本次查询对应用户数据量为 " + objList.size() + " ------------");
                for (Object obj : objList) {
                    Object[] objects = (Object[]) obj;
                    userId = String.valueOf(objects[0]);
                    userName = String.valueOf(objects[1]);
                    headImg = String.valueOf(objects[2]);
                    accountMobile = String.valueOf(objects[3]);
                    pyOfUserName = conversionPinyin(userName);
                    logger.debug("目标用户信息： " + userId + " | " + userName + " | " +  headImg);

                    data = new PlayerOutData();
                    data.setUserId(userId);
                    data.setHeadImg(headImg);
                    data.setUserName(userName);
                    data.setPyOfUserName(pyOfUserName);
                    data.setAccountMobile(accountMobile);

                    dataList.add(data);
                }
                outDto.setPlayerList(dataList);
            } else {
                logger.debug("-------- 本次未查询对应用户 皆为非注册用户 ------------");
                return null;
            }

        } catch (NoResultException | EmptyResultDataAccessException | NonUniqueResultException e) {
            e.printStackTrace();
            outDto = null;
            logger.debug("-------- 本次未查询对应用户 皆为非注册用户 ------------");
        }
        return outDto;
    }

    /**
     * 用户是否接受推送
     *
     * @param inDto
     */
    @Override
    public List<PlayerDataDto> isAgree(String userId, List<PlayerDataDto> inDto) {
        List<PlayerDataDto> dataList = new ArrayList<>();
        PlayerDataDto data;

        String targetUserId = "";
        String targetMobile = "";


        try {
            logger.debug("查询参与人数量：" + inDto.size());
            for (PlayerDataDto player: inDto) {
                targetMobile = player.getAccountMobile();
                targetUserId = player.getUserId();

                data = searchRelation(userId, targetUserId, targetMobile);

                dataList.add(data);
            }
            logger.debug("查询参与人权限完成");
        } catch (IndexOutOfBoundsException e) {
            logger.error("authRepository.isAcceptThePush 数据查询异常");
            throw new SecurityException("数据查询异常");
        }

        return dataList;
    }

    /**
     * 传入的参与人姓名/备注转化成拼音返回
     *
     * @param otherName
     * @return
     */
    @Override
    public String conversionPinyin(String otherName) {
        return Pinyin4j.toPinYin(otherName);
    }

    /**
     * 查询目标用户关系及类型
     * @param userId
     * @param targetUserId
     * @param targetMobile
     * @return
     */
    private PlayerDataDto searchRelation(String userId, String targetUserId, String targetMobile) {

        PlayerDataDto data = new PlayerDataDto();
        String sqlTargetUserId = "";
        boolean isAgree;

        try {
            Object[] objects = (Object[]) authRepository.isAcceptThePush(userId, targetUserId, targetMobile);

            if (objects[0] != null && !objects[0].equals("")) {
                sqlTargetUserId = objects[0].toString();
                if (objects[1] != null && !objects[1].equals("")) {
                    isAgree = Integer.valueOf(objects[1].toString()) != 0;
                    logger.debug("[查询到目标用户" + targetMobile + "]：targetUserId = "+ sqlTargetUserId + " | 用户[" + userId + "]你已是其好友| 接收权限" + isAgree);
                    data.setAgree(isAgree);
                    data.setUser(true);
                    data.setPlayer(true);
                    data.setUserId(sqlTargetUserId);
                } else {
                    logger.debug("[查询到目标用户" + targetMobile + "]：targetUserId = "+ sqlTargetUserId + " | 用户[" + userId + "]你不是其好友");
                    data.setUser(true);
                    data.setUserId(sqlTargetUserId);
                }
            }
            data.setAccountMobile(targetMobile);
        } catch (NoResultException | EmptyResultDataAccessException | NonUniqueResultException e) {
            e.printStackTrace();
            logger.debug("[未查询到目标用户" + targetMobile + "]：非注册用户");
            data.setUser(false);
            data.setAccountMobile(targetMobile);
        }

        return data;
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
