package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.ScheduleInDto;

/**
 * 日程类接口
 *
 * create by wzy on 2018/11/16.
 */
public interface IScheduleService {

    /**
     * 日程推送处理
     * @return
     */
    int dealWithSchedule(ScheduleInDto inDto);
}
