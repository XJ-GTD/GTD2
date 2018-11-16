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
    public BaseOutDto signUp(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 修改密码
     * @return
     */
    @RequestMapping(value = "/sign_up", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updatePassword(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 用户注销
     * @return
     */
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto logout(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 用户搜索
     * @return
     */
    @RequestMapping(value = "/search_user", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto searchUser(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 修改用户信息
     * @return
     */
    @RequestMapping(value = "/update_info", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateUserInfo(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

}
