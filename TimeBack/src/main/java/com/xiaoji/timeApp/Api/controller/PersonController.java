package com.xiaoji.timeApp.Api.controller ;

import com.xiaoji.config.exception.ServiceException;
import com.xiaoji.master.dto.*;
import com.xiaoji.master.entity.Sms;
import com.xiaoji.master.service.ICreateQueueService;
import com.xiaoji.master.service.IUserService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.CommonMethods;
import com.xiaoji.util.ResultCode;
import com.xiaoji.util.SmsManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * 用户controller
 *
 * create by wzy on 2018/08/24
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/user")
public class PersonController {

    private Logger logger = LogManager.getLogger(this.getClass());


    @Autowired
    public PersonController() {

    }

    /**
     * 用户注册
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto register(@RequestBody UserInDto inDto) {
        return null;
    }

    /**
     * 密码修改
     * @param inDto
     * @return
     */
    @PostMapping(value = "/updPWD")
    @ResponseBody
    public BaseOutDto updPWD(@RequestBody UserInDto inDto) {

        return null;
    }

    /**
     * 用户注销
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto logout(@RequestBody LabelInDto inDto) {
       return null;
    }
}
