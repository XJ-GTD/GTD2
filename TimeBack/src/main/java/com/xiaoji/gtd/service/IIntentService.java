package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.AiUiInDto;
import com.xiaoji.gtd.dto.Out;

/**
 * 语义解析方法接口
 *
 * create by wzy on 2018/09/14
 */
public interface IIntentService {

    public Out parserBase64(AiUiInDto inDto);

    public Out parserText(AiUiInDto inDto);

    public void asyncParserBase64(AiUiInDto inDto);

    public void asyncParserText(AiUiInDto inDto);

}
