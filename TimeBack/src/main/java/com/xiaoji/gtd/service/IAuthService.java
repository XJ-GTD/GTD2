package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.BaseInDto;
import com.xiaoji.gtd.dto.LoginInDto;
import com.xiaoji.gtd.dto.LoginOutDto;
import com.xiaoji.gtd.dto.Out;

/**
 * 验证类接口
 *
 * create by wzy on 2018/11/16.
 */
public interface IAuthService {

    /**
     * 游客验证
     * @return
     */
    LoginOutDto visitorsLogin(LoginInDto inDto);

    /**
     * 密码登陆验证
     * @return
     */
    LoginOutDto passwordLogin(LoginInDto inDto);

    /**
     * 短信登陆验证
     * @return
     */
    LoginOutDto smsLogin(LoginInDto inDto);
}
