package com.manager.master.service;

import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ScheduleOutDto;
import com.manager.master.entity.GtdScheduleEntity;

import java.util.List;

/**
 * 日程Service
 * @author cp
 * @since 2018/8/28
 */
public interface IScheduleService {
    int addSchedule(ScheduleInDto inDto);

    int updateSchedule(ScheduleInDto inDto);

    int deleteSchedule(ScheduleInDto inDto);
}
