package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.*;

/**
 * 用户类接口
 *
 * create by wzy on 2018/11/15.
 */
public interface IPersonService {

    /**
     * 验证手机号重复性
     * @param mobile
     * @return
     */
    boolean isRepeatMobile(String mobile);

    /**
     * 验证uuid重复性
     * @param uuid
     * @return
     */
    boolean isRepeatUuid(String uuid);

    /**
     * 用户注册
     * @param inDto
     */
    int signUp(SignUpInDto inDto);

    /**
     * 用户密码修改
     * @param inDto
     * @return
     */
    int updatePassword(UpdatePWDInDto inDto);

    /**
     * 查询密码是否正确
     * @param userId
     * @param password
     * @return
     */
    boolean isPasswordTrue(String userId, String password);

    /**
     * 查询目标用户
     * @param inDto
     * @return
     */
    SearchUserOutDto searchPlayer(SearchUserInDto inDto);
}
