package com.xiaoji.gtd.controller;

import com.xiaoji.config.interceptor.AuthCheck;
import com.xiaoji.gtd.dto.BaseInDto;
import com.xiaoji.gtd.dto.Out;
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
     * app初始化同步
     * @return
     */
    @RequestMapping(value = "/initial_sync", method = RequestMethod.POST)
    @ResponseBody
    public Out initialSync(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

    /**
     * 登陆同步
     * @return
     */
    @RequestMapping(value = "/login_sync", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out loginSync(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

    /**
     * 定时同步(上传)
     * @return
     */
    @RequestMapping(value = "/timing_upload", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out timingUpload(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

    /**
     * 定时同步(下载)
     * @return
     */
    @RequestMapping(value = "/timing_download", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out timingDownload(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

}
