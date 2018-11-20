package com.xiaoji.aispeech.service.impl;

import com.xiaoji.aispeech.bean.AiUiInBean;
import com.xiaoji.aispeech.util.AiUiUtil;
import com.xiaoji.aispeech.util.DynamicEntityUtil;
import com.xiaoji.aispeech.util.JsonParserUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.ParseException;
import java.util.Map;
import java.util.TreeMap;

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
    public Map answerAudio(String data) {
        Map<String, Object> aiuiData = new TreeMap<>();
        String outData = AiUiUtil.readAudio(data, 0);
        aiuiData = JsonParserUtil.parse(outData);

        return aiuiData;
    }

    /**
     * 上传资源
     * @return
     */
    public String update(AiUiInBean inBean){
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
