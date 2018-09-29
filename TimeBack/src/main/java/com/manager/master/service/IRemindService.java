package com.manager.master.service;

import com.manager.master.dto.RemindInsertInDto;

/**
 * 提醒时间service
 */
public interface IRemindService {

    /**
     * 插入提醒时间
     * @param inDto
     * @return
     */
    int insertRemind(RemindInsertInDto inDto);
}
