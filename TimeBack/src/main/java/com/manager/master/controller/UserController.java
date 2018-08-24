package com.manager.master.controller;

import com.manager.master.dto.BaseOutDto;
import com.manager.master.dto.UserInfoInDto;
import com.manager.master.dto.UserInfoOutDto;
import com.manager.master.service.IUserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户controller
 *
 * create by wzy on 2018/08/24
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/user")
public class UserController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    IUserService userService;

    /**
     * 用户注册
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto register(@RequestBody UserInfoInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();

        int flag = userService.registerUser(inDto);

        if (flag == 0) {
            outBean.setCode("0");
            outBean.setMessage("[注册成功]");
            logger.info("[注册成功]");
        } else if (flag == 1) {
            outBean.setCode("1");
            outBean.setMessage("[注册失败]：手机号已注册");
            logger.info("[注册失败]：手机号已注册");
        }

        return outBean;
    }

    /**
     * 用户登录
     * @param inDto
     * @return
     */
    @PostMapping(value = "/login")
    @ResponseBody
    public BaseOutDto login(UserInfoInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();

        return outBean;
    }

}
