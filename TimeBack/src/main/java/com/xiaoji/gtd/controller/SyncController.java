package com.xiaoji.gtd.controller;

import com.xiaoji.master.dto.BaseOutDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.*;

/**
 * 同步数据类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/sync")
public class SyncController {

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 登陆同步
     * @return
     */
    @RequestMapping(value = "/login_sync", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto loginSync() {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 定时同步
     * @return
     */
    @RequestMapping(value = "/timing_sync", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto timingSync() {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

}
