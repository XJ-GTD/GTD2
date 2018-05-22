package com.manager.master.controller;

import com.manager.master.dto.BaseOutDto;
import com.manager.master.service.IReadAudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ClassUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**语音处理
 * @Author: tzx ;
 * @Date: Created in 16:18 2018/4/27
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/readAudio")
public class ReadAudioController {

    @Autowired
    IReadAudioService readAudioService;

    String path_timem = ClassUtils.getDefaultClassLoader().getResource("lexicon/models/time.m").getPath();
    String path_models = ClassUtils.getDefaultClassLoader().getResource("lexicon/models").getPath();

    @RequestMapping(value = "/read", method = RequestMethod.POST)
    public BaseOutDto readAudio(HttpServletRequest request){
        BaseOutDto outBean = new BaseOutDto();
        String fileName = readAudioService.getFilePath(request);
        Map<String, Object> map = readAudioService.readAudio(fileName, path_timem, path_models);
        outBean.setData(map);
        outBean.setCode("0");
        outBean.setMessage("解析成功！");
        return outBean;
    }

}
