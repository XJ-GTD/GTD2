package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.AiUiInDto;
import com.xiaoji.gtd.dto.Out;

/**
 * 语义解析方法接口
 *
 * create by wzy on 2018/09/14
 */
public interface IIntentService {

    Out parserBase64(AiUiInDto inDto);

    Out parserText(AiUiInDto inDto);

    /**
     * 讯飞请求 音频
     * @param inDto
     */
    void asyncParserBase64(AiUiInDto inDto);

    /**
     * 讯飞请求 文本
     * @param inDto
     */
    void asyncParserText(AiUiInDto inDto);

}
