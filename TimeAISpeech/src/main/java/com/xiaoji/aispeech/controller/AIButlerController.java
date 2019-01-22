package com.xiaoji.aispeech.controller;

import com.alibaba.fastjson.JSON;
import com.xiaoji.aispeech.bean.NlpOutDto;
import com.xiaoji.aispeech.bean.VoiceInBean;
import com.xiaoji.aispeech.bean.VoiceOutBean;
import com.xiaoji.aispeech.service.IAIButlerService;
import com.xiaoji.aispeech.service.IVoiceLogrService;
import com.xiaoji.aispeech.xf.aiuiData.AiUiResponse;
import com.xiaoji.aispeech.xf.aiuiData.AiuiIntent;
import com.xiaoji.aispeech.xf.aiuiData.AiuiSub;
import com.xiaoji.aispeech.xf.aiuiData.Semantic;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/ai_butler")
public class AIButlerController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private IAIButlerService aiButlerService;

    @Autowired
    private IVoiceLogrService voiceLogrService;

    /**
     * 语音交互（MP3文件）
     * @return
     */
//    @RequestMapping(value = "/audio_mp3", method = RequestMethod.POST)
//    @ResponseBody
//    public BaseOutDto audioMp3(@RequestBody BaseInDto inDto) {
//        BaseOutDto outDto = new BaseOutDto();
//
//        return outDto;
//    }

    /**
     * 语音交互（base64文件转码）
     * @return
     */
    @RequestMapping(value = "/audio", method = RequestMethod.POST)
    @ResponseBody
    public VoiceOutBean audioBase64(@RequestBody VoiceInBean voiceInBean) {
        JSON repJson = aiButlerService.answerAudioResJSON(voiceInBean.getContent(), voiceInBean.getUserId());

        AiUiResponse response  = JSON.toJavaObject(repJson,AiUiResponse.class);
        //写入日志
        voiceLogrService.saveLog4XF(response,voiceInBean,repJson.toJSONString());

        return tranOutJsonObject(response,voiceInBean);
    }

    /**
     * 语音交互（文本）
     * @return
     */
    @RequestMapping(value = "/text", method = RequestMethod.POST)
    @ResponseBody
    public VoiceOutBean text(@RequestBody VoiceInBean voiceInBean) {


        JSON repJson = aiButlerService.answerTextResJSON(voiceInBean.getContent(), voiceInBean.getUserId());


        AiUiResponse response  = JSON.toJavaObject(repJson,AiUiResponse.class);
        //写入日志
        voiceLogrService.saveLog4XF(response,voiceInBean,repJson.toJSONString());

        return tranOutJsonObject(response,voiceInBean);
    }

    private VoiceOutBean tranOutJsonObject(AiUiResponse response, VoiceInBean voiceInBean){

        VoiceOutBean outDto = new VoiceOutBean();

        outDto.setCode(response.getCode());
        outDto.setMessage(response.getDesc());
        outDto.setUserId(voiceInBean.getUserId());
        outDto.setDeviceId(voiceInBean.getDeviceId());


        List<AiuiSub> ls =response.getData();
        List<NlpOutDto> data = new ArrayList<NlpOutDto>();

        for (AiuiSub sub:ls){
            if("nlp".equals(sub.getSub())){
                if (sub.getIntent() != null){
                    AiuiIntent intent =  sub.getIntent();

                    NlpOutDto nlp = new NlpOutDto();
                    nlp.setRc(intent.getRc());
                    nlp.setText(intent.getText());
                    if (intent.getAnswer() != null) {
                        nlp.setAnswer(intent.getAnswer().getText());
                        nlp.setAnswerImg(intent.getAnswer().getImgUrl());
                        nlp.setAnswerUrl(intent.getAnswer().getUrl());
                    }
                    if (intent.getService() != null) {
                        nlp.setService(intent.getService());
                    }
                    if (intent.getShouldEndSession() != null) {
                        nlp.setShouldEndSession(intent.getShouldEndSession());
                    }

                    if (intent.getSemantic() != null) {
                        List<Semantic> semantics = intent.getSemantic();
                        for (Semantic semantic : semantics){
                            nlp.setIntent(semantic.getIntent());
                            nlp.setSlots(semantic.getSlots());
                        }
                    }

                    data.add(nlp);
                }

            }
        }

        outDto.setData(data);
        return outDto;
    }
}
