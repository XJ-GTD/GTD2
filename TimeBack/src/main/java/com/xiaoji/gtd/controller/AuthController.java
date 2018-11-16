package com.xiaoji.gtd.controller;

import com.xiaoji.gtd.dto.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.*;

/**
 * 验证类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/auth")
public class AuthController {

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 游客验证
     * @return
     */
    @RequestMapping(value = "/login_visitors", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto loginVisitors(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 用户验证（密码）
     * @return
     */
    @RequestMapping(value = "/login_password", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto loginPassword(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 用户验证（验证码）
     * @return
     */
    @RequestMapping(value = "/login_code", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto loginAuthCode(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

}
