package com.manager.master.service;

import com.manager.master.dto.UserInfoInDto;

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
    int registerUser(UserInfoInDto inDto);
}
