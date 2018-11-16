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
@RequestMapping(value = "/sms")
public class SMSController {

    private Logger logger = LogManager.getLogger(this.getClass());


    @Autowired
    public SMSController() {

    }

    /**
     * 短信验证码
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/authcode", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto authcode(@RequestBody UserInDto inDto) {
        return null;
    }

}
