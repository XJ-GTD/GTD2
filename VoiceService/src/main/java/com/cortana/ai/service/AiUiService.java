package com.cortana.ai.service;

import com.cortana.ai.bean.AiUiInBean;
import com.cortana.ai.util.AiUiUtil;
import com.cortana.ai.util.DynamicEntityUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.ParseException;

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
