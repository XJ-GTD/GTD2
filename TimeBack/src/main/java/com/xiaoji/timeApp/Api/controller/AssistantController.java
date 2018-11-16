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
@RequestMapping(value = "/assistant")
public class AssistantController {

    private Logger logger = LogManager.getLogger(this.getClass());


    @Autowired
    public AssistantController() {

    }

    /**
     * 语音
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/audioMP3", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto audioMP3(@RequestBody UserInDto inDto) {
        return null;
    }

    /**
     * 语音(Base64)
     * @param inDto
     * @return
     */
    @PostMapping(value = "/audioBase64")
    @ResponseBody
    public BaseOutDto audioBase64(@RequestBody UserInDto inDto) {

        return null;
    }

    /**
     * 文本
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/text", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto text(@RequestBody LabelInDto inDto) {
       return null;
    }
}
