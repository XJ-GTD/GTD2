package com.cortana.ai.controller;

import com.cortana.ai.bean.VoiceBean;
import com.cortana.ai.service.AiuiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 语音助手
 *
 * create by wzy on 2018/07/20
 */
@CrossOrigin
@RestController
@RequestMapping("/cortana")
public class CortanaController {

    @Autowired
    private AiuiService aiuiService;

    @RequestMapping(value = "/receiver")
    public String parseVoice(@RequestBody VoiceBean voiceBean) {

        return null;
    }
}
