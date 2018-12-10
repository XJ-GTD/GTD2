package com.xiaoji.gtd.controller;

import com.xiaoji.config.interceptor.AuthCheck;
import com.xiaoji.gtd.dto.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.*;

/**
 * 日程类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/schedule")
public class ScheduleController {

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 新建日程
     * @return
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out addSchedule(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

    /**
     * 修改日程
     * @return
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out updateSchedule(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

    /**
     * 删除日程
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out deleteSchedule(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

    /**
     * 接受权限申请
     * @return
     */
    @RequestMapping(value = "/invite", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out inviteSchedule(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

}
