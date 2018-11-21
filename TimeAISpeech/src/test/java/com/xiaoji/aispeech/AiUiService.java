package com.xiaoji.aispeech;

import com.alibaba.fastjson.JSON;
import com.xiaoji.aispeech.util.AiUiUtil;
import com.xiaoji.aispeech.xf.aiuiData.AiUiResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class AiUiService {

    public  static void main(String[] arg){

        String raw = "";


        AiUiService service = new AiUiService();
        AiUiResponse repose = service.answerText("查一下去北京的航班");

        System.out.println(repose.getData().get(0).getIntent().getAnswer().getText());

        repose = service.answerText("上海");

        System.out.println(repose.getData().get(0).getIntent().getAnswer().getText());


        repose = service.answerText("明天");

        System.out.println(repose.getData().get(0).getIntent().getAnswer().getText());

        String path = "c:\\iat.pcm";
         repose = service.answerAudio(path);

        System.out.println(repose.getData().get(0).getSub());

    }

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 文本方法
     * @param data
     * @return
     */
    public AiUiResponse answerText(String data) {

        String outData = AiUiUtil.readAudio(data, 1);

        JSON outJson = JSON.parseObject(outData);

        AiUiResponse response  = JSON.toJavaObject(outJson,AiUiResponse.class);

        //访问数据插入数据库


        return response;

    }

    /**
     * 音频方法
     * @param data
     * @return
     */
    public AiUiResponse answerAudio(String data) {


        String outData = AiUiUtil.readAudio(data, 0);

        JSON outJson = JSON.parseObject(outData);

        AiUiResponse response  = JSON.toJavaObject(outJson,AiUiResponse.class);

        //访问数据插入数据库


        return response;
    }



}
