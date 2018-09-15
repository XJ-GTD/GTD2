package com.manager.master.service;

import com.manager.master.dto.AiUiDataDto;
import com.manager.master.dto.AiUiInDto;

import java.util.Map;

/**
 * 语义解析方法接口
 *
 * create by wzy on 2018/09/14
 */
public interface IAiUiService {

    /**
     * 文本方法
     * @param inDto
     * @return
     */
    public AiUiDataDto answerText(AiUiInDto inDto);

    /**
     * 音频方法
     * @param inDto
     * @return
     */
    public AiUiDataDto answerAudio(AiUiInDto inDto);



}
