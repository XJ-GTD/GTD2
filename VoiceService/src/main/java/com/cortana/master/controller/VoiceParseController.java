package com.xiaoji.master.controller;

import com.xiaoji.config.exception.ServiceException;
import com.xiaoji.master.dto.AiUiOutDto;
import com.xiaoji.master.dto.AiUiInDto;
import com.xiaoji.master.dto.BaseOutDto;
import com.xiaoji.master.service.IAiUiService;
import com.xiaoji.gtd.dto.code.ResultCode;
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
@RequestMapping(value = "/xiaoji")
public class VoiceParseController {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final IAiUiService aiUiService;

    @Autowired
    public VoiceParseController(IAiUiService aiUiService) {
        this.aiUiService = aiUiService;
    }

    /**
     * 语义解析： 0:音频方法 1:文本方法
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/answer_audio", method = RequestMethod.POST)
    public BaseOutDto readAudio(@RequestBody AiUiInDto inDto){
        BaseOutDto outBean = new BaseOutDto();
        try{
            AiUiOutDto dataDto = aiUiService.aiuiAnswer(inDto, 0);
            if (dataDto != null) {
                outBean.setCode(ResultCode.SUCCESS);
                outBean.setMessage("[语音交互完成]");
                logger.debug("[语音交互完成]");
            } else {
                outBean.setCode(ResultCode.REPEAT);
                outBean.setMessage("[语音数据解析失败]");
                logger.debug("[语音数据解析失败]");
            }

        } catch (Exception e){
            outBean.setCode(ResultCode.FAIL);
            outBean.setMessage("[语音交互失败]：请联系技术人员");
            logger.debug(e.getMessage());
            throw new ServiceException("[语音交互失败]：请联系技术人员");
        }

        return outBean;
    }

}
