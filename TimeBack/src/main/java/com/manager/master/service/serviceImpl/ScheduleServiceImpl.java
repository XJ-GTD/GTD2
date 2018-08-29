package com.manager.master.service.serviceImpl;

import com.manager.config.CommonMethods;
import com.manager.config.exception.ServiceException;
import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ScheduleOutDto;
import com.manager.master.entity.*;
import com.manager.master.repository.*;
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

    @Resource
    CenterScheduleLabelRepository scheduleLabelRepository;

    @Resource
    CenterGroupScheduleRepository groupScheduleRepository;


    @Override
    public int updateSchedule(ScheduleInDto inDto) {
        return 0;
    }

    @Override
    public int addSchedule(ScheduleInDto inDto){
        GtdUserEntity userEntity = new GtdUserEntity();             // 用户表
        GtdScheduleEntity scheduleEntity = new GtdScheduleEntity();       // 日程表
        GtdGroupEntity groupEntity = new GtdGroupEntity();          // 群组表
        GtdLabelEntity labelEntity = new GtdLabelEntity();          // 标签表
        Set<GtdScheduleEntity> setschedule = new HashSet<GtdScheduleEntity>();    // 日程 Set 集合
        Set<GtdGroupEntity> setgroup = new HashSet<GtdGroupEntity>();             // 群组 Set 集合
        Set<GtdLabelEntity> setlabel = new HashSet<GtdLabelEntity>();             // 标签 Set 集合
        GtdUserShceduleEntity userShceduleEntity = new GtdUserShceduleEntity();         // 用户日程表

        // 日程信息 绑定
        scheduleEntity.setScheduleName(inDto.getScheduleName().replace(" ", ""));
        scheduleEntity.setScheduleStarttime(CommonMethods.dateToStamp(inDto.getScheduleStartTime()));
        scheduleEntity.setScheduleDeadline(CommonMethods.dateToStamp(inDto.getScheduleDeadline()));
        scheduleEntity.setScheduleRepeatType(inDto.getScheduleRepeatType());
        scheduleEntity.setScheduleStatus(inDto.getScheduleStatus());
        scheduleEntity.setCreateId(inDto.getCreateId());
        scheduleEntity.setCreateDate(CommonMethods.dateToStamp(inDto.getCreateDate()));

        // 获取自增主键
        scheduleEntity = scheduleJpaRepository.saveAndFlush(scheduleEntity);
        // 日程事件表插入
        scheduleJpaRepository.save(scheduleEntity); // 插入

        // 用户表信息  绑定
        userEntity.setUserId(inDto.getUserId());
        // 用户日程表信息  绑定
        userShceduleEntity.setUserId(userEntity.getUserId());
        userShceduleEntity.setScheduleId(scheduleEntity.getScheduleId());
        userShceduleEntity.setCreateId(userEntity.getUserId());
        userShceduleEntity.setCreateDate(CommonMethods.dateToStamp(inDto.getCreateDate()));
        // 用户日程表插入
        GtdUserShceduleEntity uid = userShceduleRepository.saveAndFlush(userShceduleEntity);     // 获取自增主键
        userShceduleRepository.save(userShceduleEntity);

        List labelIds = inDto.getLabelIds(); // 标签
        if (labelIds != null) {
            for (Object id : labelIds) {
                logger.info("labelIds = "+Integer.parseInt(id.toString()));
                GtdScheduleLabelEntity scheduleLabelEntity = new GtdScheduleLabelEntity();      // 日程标签中间表
                // 日程标签表  绑定
                scheduleLabelEntity.setLabelId(Integer.parseInt(id.toString()));
                scheduleLabelEntity.setCreateId(userEntity.getUserId());
                scheduleLabelEntity.setCreateDate(CommonMethods.dateToStamp(inDto.getCreateDate()));
                scheduleLabelEntity.setScheduleId(scheduleEntity.getScheduleId());
                // 日程标签表插入
                GtdScheduleLabelEntity slid = scheduleLabelRepository.saveAndFlush(scheduleLabelEntity);     // 获取自增主键
                scheduleLabelRepository.save(scheduleLabelEntity);
            }
        }else {
            throw new ServiceException("labelIds参数不能为空");
        }

        List groupIds = inDto.getGroupIds();    // 群组
        if (groupIds != null) {
            for (Object id : groupIds) {
                logger.info("groupIds = "+Integer.parseInt(id.toString()));
                GtdGroupScheduleEntity groupScheduleEntity = new GtdGroupScheduleEntity();   // 群组日程中间表
                // 群组日程表  绑定
                groupScheduleEntity.setGroupId(Integer.parseInt(id.toString()));
                groupScheduleEntity.setCreateId(userEntity.getUserId());
                groupScheduleEntity.setCreateDate(CommonMethods.dateToStamp(inDto.getCreateDate()));
                groupScheduleEntity.setScheduleId(scheduleEntity.getScheduleId());
                // 群组日程表 插入
                GtdGroupScheduleEntity gsid = groupScheduleRepository.saveAndFlush(groupScheduleEntity);     // 获取自增主键
                groupScheduleRepository.save(groupScheduleEntity);
            }
        }else throw new ServiceException("groupIds参数不能为空");

        return 0;
    }

    @Override
    public int deleteSchedule(ScheduleInDto inDto) {
        return 0;
    }
}
