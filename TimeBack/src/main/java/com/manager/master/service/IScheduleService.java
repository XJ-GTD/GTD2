package com.manager.master.service;

import com.manager.master.dto.ScheduleInDto;
import com.manager.master.entity.GtdScheduleEntity;

import java.util.List;

/**
 * 日程Service
 * @author cp
 * @since 2018/8/28
 */
public interface IScheduleService {

    /**
     * 日程查询
     * @param inDto
     * @return
     */
    List<GtdScheduleEntity> findAll(ScheduleInDto inDto);

    /**
     * 日程详情
     * @param inDto
     * @return
     */
    GtdScheduleEntity findOne(ScheduleInDto inDto);
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
