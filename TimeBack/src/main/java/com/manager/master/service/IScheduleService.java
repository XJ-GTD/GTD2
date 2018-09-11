package com.manager.master.service;

import com.manager.master.dto.*;
import com.manager.master.entity.GtdScheduleEntity;

import java.util.List;

/**
 * 日程Service
 * @author cp
 * @since 2018/8/28
 */
public interface IScheduleService {

    /**
     * 查询自己创建的日程
     * @param inDto
     * @return
     */
    List<FindScheduleOutDto> findCreateSchedule(FindScheduleInDto inDto);

    /**
     * 查询自己参与的日程
     * @param inDto
     * @return
     */
    List<FindScheduleOutDto> findJoinSchedule(FindScheduleInDto inDto);

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

    /**
     * 日程发布撤回参与人
     * @param inDto
     * @return
     */
    int releaseToWithdrawSchedule(ScheduleInDto inDto);

    /**
     * 日程参与人状态修改
     * @param inDto
     * @return
     */
    int statusSchedule(ScheduleInDto inDto);

}
