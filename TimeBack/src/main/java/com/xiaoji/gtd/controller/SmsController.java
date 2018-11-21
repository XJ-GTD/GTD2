package com.xiaoji.gtd.controller;

import com.xiaoji.gtd.dto.BaseInDto;
import com.xiaoji.gtd.dto.Out;
import com.xiaoji.gtd.dto.SmsInDto;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.service.ISmsService;
import com.xiaoji.util.BaseUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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

    private final ISmsService smsService;

    @Autowired
    public SmsController(ISmsService smsService) {
        this.smsService = smsService;
    }

    /**
     * 短信验证码
     * @return
     */
    @RequestMapping(value = "/code", method = RequestMethod.POST)
    @ResponseBody
    public Out sendAuthCode(@RequestBody SmsInDto inDto) {
        Out outDto = new Out();
        //入参验证
        if(inDto.getAccountMobile() == null || "".equals(inDto.getAccountMobile())){
            outDto.setCode(ResultCode.FAIL);
            outDto.setMessage("[获取验证失败]：手机号不可为空");
            logger.info("[获取验证失败]：手机号不可为空");
            return outDto;
        }
        //入参正确性检测
        if(!BaseUtil.isInteger(inDto.getAccountMobile())){
            if(inDto.getAccountMobile().length()!=11){
                outDto.setCode(ResultCode.FAIL);
                outDto.setMessage("[获取验证失败]：请输入正确手机号");
                logger.info("[获取验证失败]：请输入正确手机号");
                return outDto;
            }
        }

        try {
            int flag = smsService.getAuthCode(inDto.getAccountMobile());
            if (flag == 0) {
                outDto.setCode(ResultCode.REPEAT);
                outDto.setMessage("[获取验证成功，请查看短信]");
                logger.info("[获取验证成功]");
            } else {
                outDto.setCode(ResultCode.FAIL);
                outDto.setMessage("[获取验证失败]：请稍后再试");
                logger.info("[获取验证失败]");
                return outDto;
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            outDto.setMessage("[获取验证失败]：服务器繁忙");
        }

        return outDto;
    }

    /**
     * 短信推送
     * @return
     */
    @RequestMapping(value = "/message", method = RequestMethod.POST)
    @ResponseBody
    public Out sendMessage(@RequestBody SmsInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

}
