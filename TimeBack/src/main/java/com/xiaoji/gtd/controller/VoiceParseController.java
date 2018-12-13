package com.xiaoji.gtd.controller;

import com.xiaoji.config.interceptor.AuthCheck;
import com.xiaoji.gtd.dto.AiUiInDto;
import com.xiaoji.gtd.dto.Out;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.service.IIntentService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.TimerUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

/**
 * 语音处理
 * @Author: tzx ;
 * @Date: Create by wzy on 2ResultCode.SUCCESS18/4/27
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/parse")
public class VoiceParseController {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final IIntentService intentService;

    @Autowired
    public VoiceParseController(IIntentService intentService) {
        this.intentService = intentService;
    }


    /**
     * 语义解析： ResultCode.SUCCESS:音频方法
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/audio", method = RequestMethod.POST)
    public Out readAudio(@RequestBody AiUiInDto inDto){
        Out outDto = new Out();

        //入参检测
        //必须项检测
        if(inDto.getContent() == null || "".equals(inDto.getContent())){
            outDto.setCode(ResultCode.NULL_XF_AUDIO);
            logger.debug("[调用失败]：语音内容不可为空");
            return outDto;
        }
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_UUID);
            logger.debug("[调用失败]：用户ID不可为空");
            return outDto;
        }
        if(inDto.getDeviceId() == null || "".equals(inDto.getDeviceId())){
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[调用失败]：设备ID不可为空");
            return outDto;
        }
        //入参正确性检测

        //业务逻辑
        try {
            intentService.asyncParserBase64(inDto);
            outDto.setCode(ResultCode.SUCCESS);
            logger.debug("[调用成功]");
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("[调用失败]：服务器繁忙");
        }

        return outDto;
    }


    /**
     * 语义解析： ResultCode.SUCCESS 文本方法
     * @param inDto
     * @return
     */
    @AuthCheck
    @RequestMapping(value = "/text", method = RequestMethod.POST)
    public Out readText(@RequestBody AiUiInDto inDto){
        Out outDto = new Out();

        //入参检测
        //必须项检测
        if(inDto.getContent() == null || "".equals(inDto.getContent())){
            outDto.setCode(ResultCode.NULL_XF_TEXT);
            logger.debug("[调用失败]：输入内容不可为空");
            return outDto;
        }
        if(inDto.getDeviceId() == null || "".equals(inDto.getDeviceId())){
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[调用失败]：设备ID不可为空");
            return outDto;
        }
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_UUID);
            logger.debug("[调用失败]：用户ID不可为空");
            return outDto;
        }

        //业务逻辑
        try {
            intentService.asyncParserText(inDto);
            outDto.setCode(ResultCode.SUCCESS);
            logger.debug("[调用成功]");
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("[调用失败]：服务器繁忙");
        }

        return outDto;
    }

    /**
     * 语义解析： ResultCode.SUCCESS:音频方法 1:文本方法
     * @param
     * @return
     */
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public Out readText(@RequestParam String text){
        AiUiInDto inDto = new AiUiInDto();
        inDto.setContent(text);
        inDto.setUserId("12333");
        inDto.setDeviceId("333222111");
        intentService.asyncParserText(inDto);
        Out outBean = new Out();
        outBean.setCode(ResultCode.SUCCESS);
        return outBean;
    }
}
