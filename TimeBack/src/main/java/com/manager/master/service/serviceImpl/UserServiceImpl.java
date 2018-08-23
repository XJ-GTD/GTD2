package com.manager.master.service.serviceImpl;

import com.manager.master.dao.IUserDao;
import com.manager.master.dto.UserInfoInDto;
import com.manager.master.dto.UserInfoOutDto;
import com.manager.master.entity.GtdAccountEntity;
import com.manager.master.entity.GtdUserEntity;
import com.manager.master.repository.UserRepository;
import com.manager.master.service.IUserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;


/**
 * create by wzy on 2018/04/24.
 * 用户管理
 */

@Service
@Transactional
public class UserServiceImpl implements IUserService {

    private Logger logger = LogManager.getLogger(this.getClass());
    @Resource
    private IUserDao userDao;

    @Resource
    private UserRepository userRepository;

    @Override
    public UserInfoOutDto findUser(String mobile) {
        return userDao.findUser(mobile);
    }

    @Override
    public UserInfoOutDto loginUser(String mobile, String passWord) {

        UserInfoOutDto userInfo =  userDao.loginUser(mobile, passWord);
        //判断用户账号是否存在
        if(userInfo != null){
            return userInfo;
        }else{
            return null;
        }
    }

    /**
     * 根据用户ID查询用户号码
     *
     * @param userId
     * @return
     */
    @Override
    public String findMobileById(int userId) {
        return userDao.findMobileById(userId);
    }

    /**
     * 获取上次添加日程id
     * @param
     */
    @Override
    public int selectPKId(){
        int accountId = userDao.selectPKId();
        return accountId;
    }
    /**
     * 用户注册
     *
     * @param inDto
     */
    @Override
    public int createUser(UserInfoInDto inDto) {
        String accountName = inDto.getAccountName();
        String accountPassword = inDto.getAccountPassword();
        String accountMobile = inDto.getAccountMobile();

        String userName = inDto.getUserName();
        if (userName == null){
            userName = accountMobile;
        }
        Integer userSex = inDto.getUserSex();
        Date userBirthday = inDto.getUserBirthday();
        String email = inDto.getEmail();
        String realName = inDto.getRealName();
        String idNumber = inDto.getIdNumber();
        String userHead = inDto.getUserHead();

        UserInfoOutDto uib = this.userDao.findUser(inDto.getAccountMobile());
        if (uib != null){
            return 1;
        }else {
            userDao.createAccount(accountName,accountPassword,accountMobile);
            Integer accountId = userDao.selectPKId();
            userDao.createUser(accountId,userName,userSex,userBirthday,email,realName,idNumber,userHead);
        }
        return 0;
    }

    @Override
    public void registerUser(UserInfoInDto inDto) {
        GtdAccountEntity accountEntity = new GtdAccountEntity();
        GtdUserEntity user = new GtdUserEntity();

        user.setUserName(inDto.getUserName());
        user.setUserType(0);

        //获取自增主键
        user = userRepository.saveAndFlush(user);

        accountEntity.setAccountMobile(inDto.getAccountMobile());
        accountEntity.setAccountName(inDto.getAccountName());
        accountEntity.setAccountPassword(inDto.getAccountPassword());
        accountEntity.setUserId(user.getUserId());

        user.setAccount(accountEntity);

        userRepository.save(user);
    }


}
