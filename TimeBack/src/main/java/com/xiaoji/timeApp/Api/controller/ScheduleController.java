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
@RequestMapping(value = "/schedule")
public class ScheduleController {

    private Logger logger = LogManager.getLogger(this.getClass());


    @Autowired
    public ScheduleController() {

    }

    /**
     * 用户注册
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/creat", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto creat(@RequestBody UserInDto inDto) {
        return null;
    }

    /**
     * 密码修改
     * @param inDto
     * @return
     */
    @PostMapping(value = "/update")
    @ResponseBody
    public BaseOutDto update(@RequestBody UserInDto inDto) {

        return null;
    }
}
