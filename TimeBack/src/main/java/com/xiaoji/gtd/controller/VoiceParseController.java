package com.xiaoji.gtd.controller;

import com.xiaoji.gtd.dto.Out;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.service.IIntentService;
import com.xiaoji.gtd.dto.AiUiInDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 语音处理
 * @Author: tzx ;
 * @Date: Create by wzy on 2ResultCode.SUCCESS18/4/27
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/parseIntent")
public class VoiceParseController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private IIntentService intentService;


    /**
     * 语义解析： ResultCode.SUCCESS:音频方法 1:文本方法
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/answer_audio", method = RequestMethod.POST)
    public Out readAudio(@RequestBody AiUiInDto inDto){

       intentService.asyncParserBase64(inDto);
        Out outBean = new Out();
        outBean.setCode(ResultCode.SUCCESS);
        return outBean;
    }


    /**
     * 语义解析： ResultCode.SUCCESS:音频方法 1:文本方法
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/text", method = RequestMethod.POST)
    public Out readText(@RequestBody AiUiInDto inDto){
        intentService.asyncParserText(inDto);
        Out outBean = new Out();
        outBean.setCode(ResultCode.SUCCESS);
        return outBean;
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
