package com.manager.master.service.serviceImpl;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.entity.GtdAccountEntity;
import com.manager.master.entity.GtdUserEntity;
import com.manager.master.repository.LabelJpaRespository;
import com.manager.master.repository.UserJpaRepository;
import com.manager.master.repository.UserRepository;
import com.manager.master.service.ICreateQueueService;
import com.manager.master.service.IUserService;
import com.manager.util.BaseUtil;
import com.manager.util.CommonMethods;
import com.manager.util.UUIDUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * create by wzy on 2018/04/24.
 * 用户管理
 */
@Service
@Transactional
public class UserServiceImpl implements IUserService{

    private Logger logger = LogManager.getLogger(this.getClass());
    @Autowired
    ICreateQueueService createQueueService;
    @Resource
    private UserRepository userRepository;
    @Resource
    private UserJpaRepository userJpaRepository;
    @Resource
    private LabelJpaRespository labelJpaRespository;



    /**
     * 用户注册
     * @param inDto
     * @return
     */
    @Override
    public int registerUser(UserInDto inDto) throws IOException {
        GtdAccountEntity accountEntity = new GtdAccountEntity();
        GtdUserEntity user = new GtdUserEntity();

        //检测是否存在
        Object obj = userRepository.findByMobile(inDto.getAccountMobile());
        int count = Integer.valueOf(obj.toString());
        if (count != 0) {
            return 1;
        }

        String accountName = inDto.getAccountName();
        String userName = inDto.getUserName();
        if ("".equals(userName) || userName == null) {
            userName = "用户" + inDto.getAccountMobile();
        }
        user.setUserName(userName);
        user.setUserType(0);


        //获取自增主键
        user = userJpaRepository.saveAndFlush(user);

        switch (inDto.getLoginType()) {
            case 0:
                accountEntity.setAccountMobile(inDto.getAccountMobile());
                SimpleDateFormat sf = new SimpleDateFormat("MMdd");
                accountName = "gtd" + sf.format(new Date()) + inDto.getAccountMobile();
                break;
            case 1:
                accountEntity.setAccountWechat(inDto.getAccountWechat());
                break;
            case 2:
                accountEntity.setAccountQq(inDto.getAccountQq());
                break;
        }
        accountEntity.setAccountName(accountName);
        accountEntity.setAccountPassword(inDto.getAccountPassword());
        accountEntity.setUserId(user.getUserId());
        accountEntity.setAccountUuid(UUIDUtil.getUUID());       //唯一标识码

        //一对一关系添加
        user.setAccount(accountEntity);

        userJpaRepository.save(user);
        return 0;
    }

    /**
     * 用户登录
     * @param inDto
     * @return
     */
    @Override
    public UserOutDto login(UserInDto inDto) {
        UserOutDto user = new UserOutDto();

        int typeFlag = inDto.getLoginType();
        if (typeFlag != 0 && typeFlag != 1 && typeFlag != 2 ) {
            throw new ServiceException("登陆类型出错！");
        }

        String accountName = "";
        if (inDto.getLoginType() == 0) {
            accountName = inDto.getAccountName();
        }
        if (inDto.getLoginType() == 1) {
            accountName = inDto.getAccountWechat();
        }
        if (inDto.getLoginType() == 2) {
            accountName = inDto.getAccountQq();
        }



        Object[] object = (Object[]) userRepository.login(inDto.getLoginType(), accountName, inDto.getAccountPassword());

        if (object != null) {


            user.setUserId((Integer) object[0]);
            user.setUserName((String) object[1]);
            user.setHeadImgUrl((String) object[2]);
            user.setBirthday(CommonMethods.stampToDate((Timestamp) object[3]));
            user.setUserSex((Integer) object[4]);
            user.setUserContact((String) object[5]);
            user.setAccountName((String) object[6]);
            user.setAccountMobile((String) object[7]);
            user.setAccountQq((String) object[8]);
            user.setAccountWechat((String) object[9]);
            user.setAccountUuid((String) object[10]);
            user.setAccountId((Integer) object[11]);

            String queueName="";
            String exchangeName="";
            try {
                exchangeName = createQueueService.createExchange(user.getUserId(), 1);
                queueName = createQueueService.createQueue(user.getUserId(), inDto.getDeviceId(), exchangeName) ;
            } catch (IOException e) {
                e.printStackTrace();
                throw new ServiceException("服务器异常，请稍后再试！");
            }

            user.setAccountQueue(queueName);
        } else {
            throw new ServiceException("用户名或密码错误！");
        }

        return user;
    }

    /**
     * 查询标签列表
     * @param inDto
     * @return
     */
    @Override
    public List<LabelOutDto> findLabel(LabelInDto inDto) {

        List<LabelOutDto> labelOutDtoList = null;
        int userId = inDto.getUserId();
        int labelType = inDto.getFindType();
        if (userId == 0){
            throw new ServiceException("用户ID不能为空");
        }
        if (labelType == 0){
            throw new ServiceException("标签类型不能为空");
        }
        List<Map> labelList = labelJpaRespository.findLabelList(labelType);

        if (labelList != null && labelList.size() != 0) {
            labelOutDtoList = new ArrayList<>();
            for (Map gle: labelList) {
                LabelOutDto outDto = new LabelOutDto();
                outDto.setLabelId((Integer) gle.get("LABEL_ID"));
                outDto.setLabelName((String) gle.get("LABEL_NAME"));
                labelOutDtoList.add(outDto);
            }
            logger.info("dataList: " + labelOutDtoList.toString());
        } else {
            throw new ServiceException("未查询到标签数据");
        }

        return labelOutDtoList;
    }

    /**
     * 查找用户密码
     *
     * @param userId
     * @return
     */
    @Override
    public String findPassword(Integer userId) {
        String password = null;
        try {
            password = userRepository.findPasswordByUserId(userId);
        } catch (Exception ex){
            logger.error(" ------ findPasswordByUserId 语法错误");
            logger.error(ex.getMessage());
            ex.printStackTrace();
        }
        return password;
    }

    /**
     * 修改用户密码
     *
     * @param userId
     * @param newPassword
     */
    @Override
    public void updatePassword(Integer userId, String newPassword) {
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
        String update = format.format(date);
        try {
            userJpaRepository.updatePassword(userId,newPassword,userId,CommonMethods.dateToStamp(update));
        } catch (Exception ex){
            logger.error(" ------ updatePassword 语法错误");
            logger.error(ex.getMessage());
            ex.printStackTrace();
        }
    }

    /**
     * 更新用户资料
     *
     * @param inDto
     */
    @Override
    public UserOutDto updateUserInfo(UserInDto inDto) {

        UserOutDto user = new UserOutDto();

        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
        String update = format.format(date);

        Integer userId = inDto.getUserId();          // 用户ID
        String userName = inDto.getUserName();       // 昵称
        String headImgUrl = inDto.getHeadImgUrl();   // 用户头像
        String birthday = inDto.getBirthday();       // 生日
        String userSex = inDto.getUserSex();         // 性别
        String userContent = inDto.getUserContact();    // 联系方式

        try {
            userJpaRepository.updateUserInfo(userName,headImgUrl,birthday,userSex,userContent,userId,CommonMethods.dateToStamp(update),userId);

            Object[] object = (Object[]) userRepository.findUserInfo(userId);

            if (object != null) {
                user.setUserId((Integer) object[0]);
                user.setUserName((String) object[1]);
                user.setHeadImgUrl((String) object[2]);
                user.setBirthday(CommonMethods.stampToDate((Timestamp) object[3]));
                user.setUserSex((Integer) object[4]);
                user.setUserContact((String) object[5]);
                user.setAccountName((String) object[6]);
                user.setAccountMobile((String) object[7]);
                user.setAccountQq((String) object[8]);
                user.setAccountWechat((String) object[9]);
                user.setAccountUuid((String) object[10]);
                user.setAccountId((Integer) object[11]);
                user.setAccountQueue(BaseUtil.createQueueName(user.getUserId(), inDto.getDeviceId()));
            } else {
                logger.error(" ------ 数据异常");
                throw new ServiceException("数据异常！");
            }

        } catch (Exception ex){
            logger.error(" ------ updateUserInfo 语法错误");
            logger.error(ex.getMessage());
            ex.printStackTrace();
            return null;
        }

        return user;
    }
}
