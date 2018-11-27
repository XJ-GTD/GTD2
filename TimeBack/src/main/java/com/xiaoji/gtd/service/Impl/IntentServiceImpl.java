package com.xiaoji.gtd.service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.xiaoji.aispeech.bean.NlpOutDto;
import com.xiaoji.aispeech.bean.VoiceInBean;
import com.xiaoji.aispeech.bean.VoiceOutBean;
import com.xiaoji.aispeech.xf.aiuiData.Slot;
import com.xiaoji.gtd.dto.AiUiInDto;
import com.xiaoji.gtd.dto.Out;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.dto.mq.WebSocketDataDto;
import com.xiaoji.gtd.dto.mq.WebSocketOutDto;
import com.xiaoji.gtd.dto.mq.WebSocketResultDto;
import com.xiaoji.gtd.dto.mq.WebSocketSkillEnum;
import com.xiaoji.gtd.service.IIntentService;
import com.xiaoji.gtd.service.IWebSocketService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.Pinyin4j;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
import org.springframework.web.client.AsyncRestTemplate;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * 语义解析方法接口实现类
 *
 * create by wzy on 2018/09/14
 */
@Component
public class IntentServiceImpl implements IIntentService {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final RestTemplate restTemplate;
    @Value("${intent.text.url}")
    private String textuUrl;
    @Value("${intent.base64.url}")
    private String base64Url;
    @Value("${mq.agreement.version}")
    private String version;

    private final AsyncRestTemplate asyncRestTemplate;
    private final IWebSocketService webSocketService;

    @Autowired
    public IntentServiceImpl(AsyncRestTemplate asyncRestTemplate, RestTemplate restTemplate, IWebSocketService webSocketService) {
        this.asyncRestTemplate = asyncRestTemplate;
        this.restTemplate = restTemplate;
        this.webSocketService = webSocketService;
    }


    @Override
    public Out parserBase64(AiUiInDto inDto) {
        Out ret = new Out();
        VoiceInBean in = new VoiceInBean();
        VoiceOutBean out = new VoiceOutBean();
        in.setContent(inDto.getContent());
        in.setUserId(inDto.getUserId());
        in.setDeviceId(inDto.getDeviceId());

        out = restTemplate.postForObject(this.base64Url,in,VoiceOutBean.class);

        return ret;

    }

    @Override
    public Out parserText(AiUiInDto inDto) {
        Out ret = new Out();
        VoiceInBean in = new VoiceInBean();
        VoiceOutBean out = new VoiceOutBean();
        in.setContent(inDto.getContent());
        in.setUserId(inDto.getUserId());
        in.setDeviceId(inDto.getDeviceId());
        out = restTemplate.postForObject(this.textuUrl,in,VoiceOutBean.class);

        return ret;

    }

    /**
     * 讯飞请求 音频
     * @param inDto
     */
    @Override
    public void asyncParserBase64(AiUiInDto inDto) {
        VoiceInBean in = new VoiceInBean();
        VoiceOutBean out = new VoiceOutBean();

        in.setContent(inDto.getContent());
        in.setUserId(inDto.getUserId());
        in.setDeviceId(inDto.getDeviceId());

        HttpEntity<VoiceInBean> en = new HttpEntity<VoiceInBean>(in);

        ListenableFuture<ResponseEntity<VoiceOutBean>> forEntity =  asyncRestTemplate.postForEntity(this.base64Url, en, VoiceOutBean.class);

        forEntity.addCallback(new CallBackProcess());

    }

    /**
     * 讯飞请求 文本
     * @param inDto
     */
    @Override
    public void asyncParserText(AiUiInDto inDto) {
        VoiceInBean in = new VoiceInBean();
        VoiceOutBean out = new VoiceOutBean();

        in.setContent(inDto.getContent());
        in.setUserId(inDto.getUserId());
        in.setDeviceId(inDto.getDeviceId());

        HttpEntity<VoiceInBean> en = new HttpEntity<VoiceInBean>(in);

        ListenableFuture<ResponseEntity<VoiceOutBean>> forEntity =  asyncRestTemplate.postForEntity(this.textuUrl,en,VoiceOutBean.class);

        forEntity.addCallback(new CallBackProcess());

    }

    class CallBackProcess implements ListenableFutureCallback<ResponseEntity<VoiceOutBean>>{

        @Override
        public void onFailure(Throwable throwable) {
            //TODO 失败后MQ通知客户端
            logger.error("=====rest response faliure======" + throwable.getMessage());

            WebSocketOutDto outDto = new WebSocketOutDto();

        }

        @Override
        public void onSuccess(ResponseEntity<VoiceOutBean> voiceOutBeanResponseEntity) {
            //TODO 成功后改写逻辑用MQ发出
            logger.debug("--->async rest response success----, result = "+ Pinyin4j.toPinYin(voiceOutBeanResponseEntity.getBody().getData().get(0).getAnswer()));

            VoiceOutBean parseData = voiceOutBeanResponseEntity.getBody();
            WebSocketOutDto outDto = new WebSocketOutDto();

            String code = parseData.getCode();
            String message = parseData.getMessage();
            String deviceId = parseData.getDeviceId();
            String userId = parseData.getUserId();
            List<NlpOutDto> data = parseData.getData();

            String queueName = BaseUtil.getQueueName(userId, deviceId);
            outDto.setVersion(version);

            if (!code.equals("0")) {
                outDto.setStatus(ResultCode.FAIL);
                webSocketService.pushMessage(queueName, outDto);
                return;
            }
            for (NlpOutDto nod: data) {
                String flag = WebSocketSkillEnum.getIntentCode(splitStr(nod.getService()));
                if (flag != null && flag.equals("0")) {
                    String skillType = WebSocketSkillEnum.getIntentCode(nod.getIntent());
                    outDto.setSkillType(skillType);
                    outDto.setResult(dealWithSlots(nod));
                } else {
                    outDto.setAnswerText(nod.getText());
                    outDto.setAnswerUrl(nod.getAnswerUrl());
                    outDto.setAnswerImg(nod.getAnswerImg());
                }
                outDto.setStatus(ResultCode.SUCCESS);
                webSocketService.pushMessage(queueName, outDto);
                outDto = new WebSocketOutDto();
            }
        }

        private WebSocketResultDto dealWithSlots(NlpOutDto nod) {
            WebSocketResultDto result = new WebSocketResultDto();
            WebSocketDataDto data = new WebSocketDataDto();

            for (Slot slot: nod.getSlots()) {
                switch (slot.getName()) {
                    case "time":
                        String[] timeList = JSONObject.parseObject(slot.getNormValue()).getString("datetime").split("/");
                        data.setStartTime(timeList[0]);
                        data.setEndTime(timeList[1]);
                        break;
                    case "schedule":
                        data.setScheduleName(slot.getNormValue());
                        break;
                    case "player":
                        data.setPlayerName(slot.getNormValue());
                        break;
                    case "plan":
                        data.setPlanName(slot.getNormValue());
                        break;
                    case "label":
                        data.setLabel(slot.getNormValue());
                        break;
                    case "status":
                        data.setStatus(slot.getNormValue());
                        break;
                }

            }
            result.setData(data);
            return result;
        }

        private String splitStr(String str) {
            return str.split("\\.")[0];
        }
    }


}
