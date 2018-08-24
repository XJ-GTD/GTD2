package com.manager.master.service.serviceImpl;

import com.manager.master.dto.UserInDto;
import com.manager.master.entity.GtdAccountEntity;
import com.manager.master.entity.GtdUserEntity;
import com.manager.master.repository.UserJpaRepository;
import com.manager.master.repository.UserRepository;
import com.manager.master.service.IUserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;


/**
 * create by wzy on 2018/04/24.
 * 用户管理
 */
@Service
@Transactional
public class UserServiceImpl implements IUserService {

    private Logger logger = LogManager.getLogger(this.getClass());
    @Resource
    private UserRepository userRepository;

    @Resource
    private UserJpaRepository userJpaRepository;


    /**
     * 用户注册
     * @param inDto
     * @return
     */
    @Override
    public int registerUser(UserInDto inDto) {
        GtdAccountEntity accountEntity = new GtdAccountEntity();
        GtdUserEntity user = new GtdUserEntity();

        //检测是否存在
        Object count = userRepository.findByMobile(inDto.getAccountMobile());
        if (!count.equals("0")) {
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

        user.setAccount(accountEntity);

        userJpaRepository.save(user);
        return 0;
    }


}
