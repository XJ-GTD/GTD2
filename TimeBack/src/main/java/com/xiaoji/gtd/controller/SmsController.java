package com.xiaoji.gtd.controller;

import com.xiaoji.gtd.dto.BaseInDto;
import com.xiaoji.gtd.dto.BaseOutDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.*;

/**
 * 短信息推送类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/sms")
public class SmsController {

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 短信验证码
     * @return
     */
    @RequestMapping(value = "/code", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto sendAuthCode(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

    /**
     * 短信推送
     * @return
     */
    @RequestMapping(value = "/message", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto sendMessage(@RequestBody BaseInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        return outDto;
    }

}
