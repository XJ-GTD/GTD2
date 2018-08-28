package com.manager.master.service.serviceImpl;

import com.manager.config.CommonMethods;
import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ScheduleOutDto;
import com.manager.master.entity.*;
import com.manager.master.repository.CenterUserShceduleRepository;
import com.manager.master.repository.ScheduleJpaRepository;
import com.manager.master.repository.UserJpaRepository;
import com.manager.master.service.IScheduleService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 日程Service实现类
 * @author cp
 * @since 2018/8/28
 */
@Service
@Transactional
public class ScheduleServiceImpl implements IScheduleService {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Resource
    ScheduleJpaRepository scheduleJpaRepository;

    @Resource
    CenterUserShceduleRepository userShceduleRepository;

    @Override
    public int addSchedule(ScheduleInDto inDto){
        GtdUserShceduleEntity userShceduleEntity = new GtdUserShceduleEntity(); // 用户日程表
        GtdGroupEntity groupEntity = new GtdGroupEntity();  // 群组表
        Set<GtdScheduleEntity> Setschedule = new HashSet<GtdScheduleEntity>();    // 群组 Set 集合
        GtdLabelEntity labelEntity = new GtdLabelEntity();  // 标签表
        Set<GtdLabelEntity> Setlabel = new HashSet<GtdLabelEntity>();
        GtdScheduleEntity schedule = new GtdScheduleEntity();       // 日程表

        // 日程信息 绑定
        schedule.setScheduleName(inDto.getScheduleName().replace(" ", ""));
        schedule.setScheduleStarttime(CommonMethods.dateToStamp(inDto.getScheduleStartTime()));
        schedule.setScheduleDeadline(CommonMethods.dateToStamp(inDto.getScheduleDeadline()));
        schedule.setScheduleRepeatType(inDto.getScheduleRepeatType());
        schedule.setScheduleStatus(inDto.getScheduleStatus());
        schedule.setCreateId(inDto.getCreateId());
        schedule.setCreateDate(CommonMethods.dateToStamp(inDto.getCreateDate()));

        // 获取自增主键
        GtdScheduleEntity scheduleId = scheduleJpaRepository.saveAndFlush(schedule);

        schedule.setScheduleId(scheduleId.getScheduleId()); // 主键赋值绑定
        Setschedule.add(schedule);  // Set 群组绑定日程事件ID

        // 日程事件表插入
        scheduleJpaRepository.save(schedule); // 插入

        // 用户日程表插入
        userShceduleEntity.setUserId(inDto.getUserId());
        userShceduleEntity.setScheduleId(schedule.getScheduleId());
        userShceduleEntity.setCreateId(inDto.getCreateId());
        userShceduleEntity.setCreateDate(CommonMethods.dateToStamp(inDto.getCreateDate()));

        userShceduleRepository.save(userShceduleEntity);

        List groupIds = inDto.getGroupIds();                 // 群组
        List labelId = inDto.getLabelIds();                         // 标签
        //schedule.setLabel(labelId);

        // TODO 群组日程表、标签日程表
        // 标签
        labelEntity.setLabelId(1);
        labelEntity.setCreateId(3);
        labelEntity.setSchedule(schedule);

        // 群组
        groupEntity.setCreateId(3);
        groupEntity.setGroupId(1);
        groupEntity.setSchedule(Setschedule);

        return 0;
    }
}
