package com.xiaoji.timeApp.Api.controller;

import com.xiaoji.master.dto.BaseOutDto;
import com.xiaoji.master.dto.LabelInDto;
import com.xiaoji.master.dto.UserInDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 用户controller
 *
 * create by wzy on 2018/08/24
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/login")
public class AuthController {

    private Logger logger = LogManager.getLogger(this.getClass());


    @Autowired
    public AuthController() {

    }

    /**
     * 游客验证
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/visitors", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto visitors(@RequestBody UserInDto inDto) {
        return null;
    }

    /**
     * 用户验证（密码）
     * @param inDto
     * @return
     */
    @PostMapping(value = "/password")
    @ResponseBody
    public BaseOutDto password(@RequestBody UserInDto inDto) {

        return null;
    }

    /**
     * 用户验证（短信）
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/authcode", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto authcode(@RequestBody LabelInDto inDto) {
       return null;
    }
}
