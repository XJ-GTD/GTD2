package com.xiaoji.master.service;

import com.xiaoji.master.dto.LabelInDto;
import com.xiaoji.master.dto.LabelOutDto;
import com.xiaoji.master.dto.UserInDto;
import com.xiaoji.master.dto.UserOutDto;

import java.io.IOException;
import java.util.List;

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
    int registerUser(UserInDto inDto) throws IOException;

    /**
     * 用户登录
     * @param inDto
     * @return
     */
    UserOutDto login(UserInDto inDto);

    /**
     * 查询标签列表
     * @param inDto
     * @return
     */
    List<LabelOutDto> findLabel(LabelInDto inDto);

    /**
     * 查找用户密码
     * @param userId
     * @return
     */
    String findPassword(Integer userId);

    /**
     *  修改用户密码
     * @param userId
     * @param newPassword
     */
    void updatePassword(Integer userId,String newPassword);

    /**
     *  更新用户资料
     * @param inDto
     */
    UserOutDto updateUserInfo(UserInDto inDto);

    /**
     * 验证码登陆
     * @param inDto
     * @return
     */
    UserOutDto codeLogin(UserInDto inDto);
}
