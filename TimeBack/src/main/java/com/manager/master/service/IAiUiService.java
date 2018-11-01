package com.manager.master.service;

import com.manager.master.dto.AiUiOutDto;
import com.manager.master.dto.AiUiInDto;

/**
 * 语义解析方法接口
 *
 * create by wzy on 2018/09/14
 */
public interface IAiUiService {

    /**
     * 语义方法
     * @param inDto
     * @return
     */
    public AiUiOutDto aiuiAnswer(AiUiInDto inDto, int flag);

}
