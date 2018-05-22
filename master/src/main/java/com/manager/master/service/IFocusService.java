package com.manager.master.service;

import com.manager.master.dto.FocusInDto;

/**
 * 个人关注
 */
public interface IFocusService {
    /**
     * 个人关注表创建
     * @param
     */
    void  createFocus(FocusInDto InDto);
}
