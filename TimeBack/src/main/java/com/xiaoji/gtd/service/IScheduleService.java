package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.schedule.ScheduleInDto;
import com.xiaoji.gtd.dto.player.SearchOutDto;
import com.xiaoji.gtd.dto.schedule.ScheduleOutDto;

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
    ScheduleOutDto dealWithSchedule(ScheduleInDto inDto);
}
