package com.xiaoji.aispeech.service.impl;

import com.alibaba.fastjson.JSON;
import com.xiaoji.aispeech.bean.AiuiDynamiceEntityBean;
import com.xiaoji.aispeech.bean.VoiceInBean;
import com.xiaoji.aispeech.service.IAIButlerService;
import com.xiaoji.aispeech.util.AiUiUtil;
import com.xiaoji.aispeech.util.DynamicEntityUtil;
import com.xiaoji.aispeech.xf.aiuiData.AiUiResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.text.ParseException;

/**
 * 语音助手接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
public class AIButlerServiceImpl implements IAIButlerService {
    private Logger logger = LogManager.getLogger(this.getClass());
    /**
     * 文本方法
     * @param data
     * @return
     */
    public AiUiResponse answerText(String data, String userId) {

        JSON outJson = this.answerTextResJSON(data, userId);

        AiUiResponse response  = JSON.toJavaObject(outJson,AiUiResponse.class);

        return response;

    }

    /**
     * 音频方法
     * @param data
     * @return
     */
    public AiUiResponse answerAudio(String data, String userId) {


        JSON outJson = this.answerTextResJSON(data, userId);

        AiUiResponse response  = JSON.toJavaObject(outJson,AiUiResponse.class);

        return response;
    }

    @Override
    public JSON answerTextResJSON(String data, String userId) {
        logger.debug("service*********************************" + data);
        String outData = AiUiUtil.readAudio(data, 1, userId);
        logger.debug("service*********************************outData" + outData);
        JSON outJson = JSON.parseObject(outData);
        logger.debug("service*********************************outJson" + outJson);
        return outJson;
    }

    @Override
    public JSON answerAudioResJSON(String data, String userId) {
        String outData = AiUiUtil.readAudio(data, 0, userId);
        JSON outJson = JSON.parseObject(outData);
        return outJson;
    }

    /**
     * 上传资源
     * @return
     */
    public String update(AiuiDynamiceEntityBean inBean){
        try {
            String outData = DynamicEntityUtil.update(inBean);
            return outData;
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }

}
