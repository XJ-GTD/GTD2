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
    /**
     * 新增日程
     * @param inDto
     * @return
     */
    int addSchedule(ScheduleInDto inDto);

    /**
     * 更新日程
     * @param inDto
     * @return
     */
    int updateSchedule(ScheduleInDto inDto);

    /**
     * 删除日程
     * @param inDto
     * @return
     */
    int deleteSchedule(ScheduleInDto inDto);
}
