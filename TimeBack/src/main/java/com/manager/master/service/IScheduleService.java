package com.manager.master.service;

import com.manager.master.dto.PersonScheduleDto;
import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ScheduleOutDto;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
 * create by zy on 2018/05/05.
 *  * 日程管理
 */
public interface IScheduleService {

    /**
     * 查询个人日程信息
     * @return
     */
    List<ScheduleOutDto>  findSchedule(int scheduleExecutor);
    /**
     * 日程创建
     * @param
     */
    int createSchedule(@RequestBody ScheduleInDto inDto);

    /**
     * 日程关联创建（执行事件表）
     * @param
     */
//    void  createExecutorSchedule(@RequestBody ScheduleInDto inDto);


    /**
     * 查询个人单条日程信息
     * @return
     */
    ScheduleOutDto  findScheduleByOne(int scheduledId);
    /**
     * 编辑个人单条日程信息
     * @return
     */
    int  updateSchedule(ScheduleInDto inDto);

    /**
     * 查询一个群组下的所有日程
     * @return
     */
    List<ScheduleOutDto>  findScheduleByGroup(String groupId);

    /**
     * 查询一个群组下的所有日程（含有执行人姓名）
     * @return
     */
    List<ScheduleOutDto>  findScheduleAndUserName(String groupId);

    /**
     * 根据事件ID和执行人ID查询事件表和执行事件表。
     * @return
     */
    ScheduleOutDto  findScheduleAndExeBySchIdAndUserId(int scheduleId,int userId);


    /**
     * 群组事件创建
     * @param
     */
     int createSchByGroupId(@RequestBody ScheduleInDto inDto);

    /**
     * 个人日历日程查询
     * @return
     */
    PersonScheduleDto createSchByCalendar(String date,int userId);

    /**
     * 编辑个人单条日程信息
     * @return
     */
    int  updateScheduleByScheduleIdAndUserId(ScheduleInDto inDto);

    /**
     * 发布新任务
     * @param inDto
     * @return
     */
    public ScheduleOutDto taskAnnouncement(ScheduleInDto inDto);

    /**
     * 接受任务更改状态
     * @param scheduleId
     * @param userId
     * @param state -1 拒绝 1接受未完成 0完成
     * @return
     */
    public int updateState(int scheduleId, String userId, int state);
}
