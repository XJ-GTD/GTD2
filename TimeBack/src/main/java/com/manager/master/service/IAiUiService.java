package com.manager.master.service;

import com.manager.master.dto.AiUiDataOutDto;
import com.manager.master.dto.AiUiInDto;

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
    public AiUiDataOutDto answerText(AiUiInDto inDto);

    /**
     * 音频方法
     * @param inDto
     * @return
     */
    public AiUiDataOutDto answerAudio(AiUiInDto inDto);



}
