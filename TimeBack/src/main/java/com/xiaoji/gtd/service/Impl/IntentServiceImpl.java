package com.xiaoji.gtd.service.Impl;

import com.xiaoji.aispeech.bean.VoiceInBean;
import com.xiaoji.aispeech.bean.VoiceOutBean;
import com.xiaoji.gtd.dto.AiUiInDto;
import com.xiaoji.gtd.dto.Out;
import com.xiaoji.gtd.service.IIntentService;
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

    private final AsyncRestTemplate asyncRestTemplate;

    @Autowired
    public IntentServiceImpl(AsyncRestTemplate asyncRestTemplate, RestTemplate restTemplate) {
        this.asyncRestTemplate = asyncRestTemplate;
        this.restTemplate = restTemplate;
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

    @Override
    public void asyncParserBase64(AiUiInDto inDto) {
        VoiceInBean in = new VoiceInBean();
        VoiceOutBean out = new VoiceOutBean();
        in.setContent(inDto.getContent());
        in.setUserId(inDto.getUserId());
        in.setDeviceId(inDto.getDeviceId());

        HttpEntity<VoiceInBean> en = new HttpEntity<VoiceInBean>(in);


        ListenableFuture<ResponseEntity<VoiceOutBean>> forEntity =  asyncRestTemplate.postForEntity(this.base64Url,en,VoiceOutBean.class);

        forEntity.addCallback(new CallBackProcess());
    }

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
            logger.error("=====rest response faliure======");

        }

        @Override
        public void onSuccess(ResponseEntity<VoiceOutBean> voiceOutBeanResponseEntity) {


            //TODO 成功后改写逻辑用MQ发出
            logger.info("--->async rest response success----, result = "+voiceOutBeanResponseEntity.getBody().getData().get(0).getAnswer());
        }
    }
}
