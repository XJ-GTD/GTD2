package com.manager.master.controller;

import com.manager.master.service.IScheduleService;
import com.manager.util.ProducerUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 日程Controller
 *
 * create by wzy on 2018/08/24
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/schedule")
public class ScheduleController {

    private Logger logger = LogManager.getLogger(this.getClass());
    private final IScheduleService scheduleService;

    @Autowired
    public ScheduleController(IScheduleService scheduleService, ProducerUtil producerUtil) {
        this.scheduleService = scheduleService;
    }



}
