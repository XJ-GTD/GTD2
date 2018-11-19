package com.xiaoji.gtd.controller;

import com.xiaoji.gtd.dto.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.*;

/**
 * 用户类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/person")
public class PersonController {

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 用户注册
     * @return
     */
    @RequestMapping(value = "/sign_up", method = RequestMethod.POST)
    @ResponseBody
    public Out signUp(@RequestBody SignUpInDto inDto) {
        Out outDto = new Out();
        SignUpOutDto user = new SignUpOutDto();
        //验证手机号码正确

        //验证手机号码重复

        //验证验证码是否正确

        //生产注册用户数据

        //创建用户相关数据


        outDto.setData(user);
        return outDto;
    }

    /**
     * 修改密码
     * @return
     */
    @RequestMapping(value = "/updatePassword", method = RequestMethod.POST)
    @ResponseBody
    public Out updatePassword(@RequestBody UpdatePWDInDto inDto) {
        Out outDto = new Out();
        //校验验证码

        //更新密码

        return outDto;
    }

    /**
     * 用户注销
     * @return
     */
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    @ResponseBody
    public Out logout(@RequestBody UpdatePWDInDto inDto) {
        Out outDto = new Out();


        return outDto;
    }

    /**
     * 用户搜索
     * @return
     */
    @RequestMapping(value = "/search_user", method = RequestMethod.POST)
    @ResponseBody
    public Out searchUser(@RequestBody SearchUserInDto inDto) {
        Out outDto = new Out();

        //检索用户

        //返回用户数据List

        return outDto;
    }

    /**
     * 修改用户信息
     * @return
     */
    @RequestMapping(value = "/update_info", method = RequestMethod.POST)
    @ResponseBody
    public Out updateUserInfo(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

}
