package com.xiaoji.aispeech.service;

import com.alibaba.fastjson.JSON;
import com.xiaoji.aispeech.bean.AiuiDynamiceEntityBean;
import com.xiaoji.aispeech.xf.aiuiData.AiUiResponse;

/**
 * 语音助手类接口
 *
 * create by wzy on 2018/11/16.
 */
public interface IAIButlerService {

    /**
     * 文本方法
     * @param data
     * @return
     */
    public AiUiResponse answerText(String data) ;

    /**
     * 音频方法
     * @param data
     * @return
     */
    public AiUiResponse answerAudio(String data);

    /**
     * 文本方法
     * @param data
     * @return
     */
    public JSON answerTextResJSON(String data) ;

    /**
     * 音频方法
     * @param data
     * @return
     */
    public JSON answerAudioResJSON(String data);

    /**
     * 上传资源
     * @return
     */
    public String update(AiuiDynamiceEntityBean inBean);
}
