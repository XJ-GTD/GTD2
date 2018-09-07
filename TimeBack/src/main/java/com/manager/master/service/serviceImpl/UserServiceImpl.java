package com.manager.master.service.serviceImpl;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.LabelInDto;
import com.manager.master.dto.LabelOutDto;
import com.manager.master.dto.UserInDto;
import com.manager.master.dto.UserOutDto;
import com.manager.master.entity.GtdAccountEntity;
import com.manager.master.entity.GtdLabelEntity;
import com.manager.master.entity.GtdUserEntity;
import com.manager.master.repository.LabelRespository;
import com.manager.master.repository.UserJpaRepository;
import com.manager.master.repository.UserRepository;
import com.manager.master.service.CreateQueueService;
import com.manager.master.service.IUserService;
import com.manager.master.service.IWebSocketService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;


/**
 * create by wzy on 2018/04/24.
 * 用户管理
 */
@Service
@Transactional
public class UserServiceImpl implements IUserService{

    private Logger logger = LogManager.getLogger(this.getClass());
    @Autowired
    CreateQueueService createQueueService;
    @Resource
    private UserRepository userRepository;
    @Resource
    private UserJpaRepository userJpaRepository;
    @Resource
    private LabelRespository labelRespository;



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

        user.setUserName(inDto.getUserName());
        user.setUserType(0);

        //获取自增主键
        user = userJpaRepository.saveAndFlush(user);

        switch (inDto.getLoginType()) {
            case 0:
                accountEntity.setAccountMobile(inDto.getAccountMobile());
                break;
            case 1:
                accountEntity.setAccountWechat(inDto.getAccountWechat());
                break;
            case 2:
                accountEntity.setAccountQq(inDto.getAccountQq());
                break;
        }
        accountEntity.setAccountName(inDto.getAccountName());
        accountEntity.setAccountPassword(inDto.getAccountPassword());
        accountEntity.setUserId(user.getUserId());
        String queueName="";
        try {
            queueName=createQueueService.createQueue(user.getUserId(),"exchange") ;
        } catch (IOException e) {
            e.printStackTrace();
            throw new ServiceException("服务器异常，请稍后再试！");
        }
        if(!"".equals(queueName)){
            accountEntity.setAccountQueue(queueName);
        }
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
            user.setAccountQueue((String) object[10]);
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

        int userId = inDto.getUserId();
        int findType = inDto.getFindType();
        if (userId == 0){
            throw new ServiceException("用户ID不能为空");
        }
        if (findType != 0 && findType != 1){
            throw new ServiceException("标签类型不能为空");
        }
        List<LabelOutDto> labelList = labelRespository.findLabelList(userId, findType);

        return labelList;
    }
}
