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
@RequestMapping(value = "/sync")
public class SyncController {

    private Logger logger = LogManager.getLogger(this.getClass());


    @Autowired
    public SyncController() {

    }

    /**
     * 用户注册
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/init", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto initSync(@RequestBody UserInDto inDto) {
        return null;
    }

    /**
     * 密码修改
     * @param inDto
     * @return
     */
    @PostMapping(value = "/fromClient")
    @ResponseBody
    public BaseOutDto fromClient(@RequestBody UserInDto inDto) {

        return null;
    }

    /**
     * 用户注销
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/toClient", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto toClient(@RequestBody LabelInDto inDto) {
       return null;
    }
}
