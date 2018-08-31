package com.manager.master.service;

import com.manager.master.dto.UserInDto;
import com.manager.master.dto.UserOutDto;
import com.manager.master.entity.GtdUserEntity;

/**
 * create by wzy on 2018/04/24.
 * 用户管理
 */
public interface IUserService {

    /**
     * 用户注册
     * @param inDto
     * @return
     */
    int registerUser(UserInDto inDto);

    /**
     * 用户登录
     * @param inDto
     * @return
     */
    UserOutDto login(UserInDto inDto);
}
