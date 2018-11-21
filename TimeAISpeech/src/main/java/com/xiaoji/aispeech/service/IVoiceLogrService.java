package com.xiaoji.aispeech.service;

import com.xiaoji.aispeech.bean.VoiceInBean;
import com.xiaoji.aispeech.entity.VoiceLogEntity;
import com.xiaoji.aispeech.xf.aiuiData.AiUiResponse;

/**
 *
 *
 * create by wzy on 2018/11/16.
 */
public interface IVoiceLogrService {

    public VoiceLogEntity saveLog4XF(AiUiResponse response, VoiceInBean inbean,String resOriginal);
}
