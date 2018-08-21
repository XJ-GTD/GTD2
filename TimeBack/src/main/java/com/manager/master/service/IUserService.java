package com.manager.master.service;

import com.manager.master.bean.UserAccountBean;
import com.manager.master.dto.UserInfoInDto;
import com.manager.master.dto.UserInfoOutDto;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
 * create by wzy on 2018/04/24.
 * 用户管理
 */
public interface IUserService {

    /**
     * 根据手机号码询用户信息
     * @return
     */
    UserInfoOutDto findUser(String mobile);
    /**
     * 用户登录
     * @param mobile  登录账号
     * @param passWord    登录密码
     */
    UserInfoOutDto loginUser(String mobile, String passWord);

    /**
     * 根据用户ID查询用户号码
     * @param userId
     * @return
     */
    String findMobileById(int userId);

    /**
     * 获取上次添加的userId
     * @param
     */
    int selectPKId();

    /**
     * 用户注册
     * @param
     */
    int createUser( @RequestBody UserInfoInDto inDto );

}
