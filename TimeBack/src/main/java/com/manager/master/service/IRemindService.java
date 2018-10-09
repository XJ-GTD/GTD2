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

    /**
     * 提醒时间更新
     * @param userId        用户id
     * @param remindDate    提醒时间：yyyy-MM-dd HH:mm
     * @param remindType    提醒类型
     * @param remindId      提醒时间id
     * @return
     */
    int updateRemindDate(Integer userId,String remindDate,Integer remindType,Integer remindId);
}
