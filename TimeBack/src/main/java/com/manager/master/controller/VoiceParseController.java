package com.manager.master.controller;

import com.manager.master.dto.BaseOutDto;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * 语音处理
 * @Author: tzx ;
 * @Date: Create by wzy on 2018/4/27
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/xiaoji")
public class VoiceParseController {

    @RequestMapping(value = "/audio", method = RequestMethod.POST)
    public BaseOutDto readAudio(HttpServletRequest request){
        BaseOutDto outBean = new BaseOutDto();

        return outBean;
    }

    @RequestMapping(value = "/text", method = RequestMethod.POST)
    public BaseOutDto readText(HttpServletRequest request){
        BaseOutDto outBean = new BaseOutDto();

        return outBean;
    }

}
