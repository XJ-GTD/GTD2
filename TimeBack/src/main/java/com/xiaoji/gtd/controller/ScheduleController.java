package com.xiaoji.gtd.controller;

import com.xiaoji.config.interceptor.AuthCheck;
import com.xiaoji.gtd.dto.*;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.service.IScheduleService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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

    private final IScheduleService scheduleService;

    @Autowired
    public ScheduleController(IScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    /**
     * 推送日程消息
     * @return
     */
    @RequestMapping(value = "/deal", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out dealWithSchedule(@RequestBody ScheduleInDto inDto) {
        Out outDto = new Out();

        //入参检测
        //非空检测

        try {

        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("日程推送失败：服务器错误");
        }

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

}
