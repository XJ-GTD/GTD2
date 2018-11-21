package com.xiaoji.gtd.service;

import com.xiaoji.master.dto.AiUiInDto;
import com.xiaoji.master.dto.AiUiOutDto;

/**
 * 语义解析方法接口
 *
 * create by wzy on 2018/09/14
 */
public interface IIntentService {

    public AiUiOutDto parserBase64(AiUiInDto inDto);

    public AiUiOutDto parserText(AiUiInDto inDto);

    public void asyncParserBase64(AiUiInDto inDto);

    public void asyncParserText(AiUiInDto inDto);

}
