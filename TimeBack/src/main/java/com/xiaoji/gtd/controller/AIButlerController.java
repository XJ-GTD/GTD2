package com.xiaoji.gtd.controller;

import com.xiaoji.gtd.dto.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.*;

/**
 * AI助手类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/aibutler")
public class AIButlerController {

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 语音交互（MP3文件）
     * @return
     */
    @RequestMapping(value = "/audio_mp3", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto audioMp3(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 语音交互（base64文件转码）
     * @return
     */
    @RequestMapping(value = "/audio_base64", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto audioBase64(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 语音交互（文本）
     * @return
     */
    @RequestMapping(value = "/text", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto addSchedule(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }
}
