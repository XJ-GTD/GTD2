package com.cortana.ai.service;

import com.cortana.ai.util.AiUiUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class AiUiService {

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 文本方法
     * @param data
     * @return
     */
    public String answerText(String data) {

        String outData = AiUiUtil.readAudio(data, 1);
        return outData;

    }

    /**
     * 音频方法
     * @param data
     * @return
     */
    public String answerAudio(String data) {

        String outData = AiUiUtil.readAudio(data, 0);


        return outData;
    }
}
