package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.LoginInDto;
import com.xiaoji.gtd.dto.LoginOutDto;
import com.xiaoji.gtd.dto.SignUpInDto;

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


}
