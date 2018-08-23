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
 * create by wzy on 2018/04/24.
 * 用户类
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/user")
public class UserController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    IUserService userService;

    /**
     *
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto test(@RequestBody UserInfoInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();

        userService.registerUser(inDto);

        outBean.setCode("0");
        outBean.setMessage("[注册成功]");
        logger.info("[注册成功]");
        return outBean;
    }


}
