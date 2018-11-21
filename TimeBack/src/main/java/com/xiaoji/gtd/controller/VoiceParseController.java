package com.xiaoji.gtd.controller;

import com.xiaoji.config.exception.ServiceException;
import com.xiaoji.gtd.service.IIntentService;
import com.xiaoji.master.dto.AiUiInDto;
import com.xiaoji.master.dto.AiUiOutDto;
import com.xiaoji.master.dto.BaseOutDto;
import com.xiaoji.master.service.IAiUiService;
import com.xiaoji.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 语音处理
 * @Author: tzx ;
 * @Date: Create by wzy on 2018/4/27
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/parseIntent")
public class VoiceParseController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private IIntentService intentService;


    /**
     * 语义解析： 0:音频方法 1:文本方法
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/answer_audio", method = RequestMethod.POST)
    public BaseOutDto readAudio(@RequestBody AiUiInDto inDto){

       intentService.parserBase64(inDto);
        BaseOutDto outBean = new BaseOutDto();
        outBean.setCode(0);
        return outBean;
    }


    /**
     * 语义解析： 0:音频方法 1:文本方法
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/text", method = RequestMethod.POST)
    public BaseOutDto readText(@RequestBody AiUiInDto inDto){
        intentService.asyncParserText(inDto);
        BaseOutDto outBean = new BaseOutDto();
        outBean.setCode(0);
        return outBean;
    }

    /**
     * 语义解析： 0:音频方法 1:文本方法
     * @param
     * @return
     */
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public BaseOutDto readText(@RequestParam String text){
        AiUiInDto inDto = new AiUiInDto();
        inDto.setContent(text);
        inDto.setUserId("12333");
        inDto.setDeviceId("333222111");
        intentService.asyncParserText(inDto);
        BaseOutDto outBean = new BaseOutDto();
        outBean.setCode(0);
        return outBean;
    }
}
