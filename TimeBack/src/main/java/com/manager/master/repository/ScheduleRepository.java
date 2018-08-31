package com.manager.master.repository;

import com.manager.master.dto.ScheduleOutDto;
import com.manager.master.entity.GtdScheduleEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *  日程事件表实现类
 *  @author cp
 *  @since 2018/8/24
 */
@Transactional
@Repository
public class ScheduleRepository {
    @PersistenceContext
    private EntityManager em;

    public ScheduleOutDto findByScheduleId(Integer id) {

        String sql = "SELECT SCHEDULE_ID scheduleId,SCHEDULE_NAME scheduleName,SCHEDULE_STARTTIME scheduleStartTime," +
                "SCHEDULE_DEADLINE scheduleDeadline,SCHEDULE_REPEAT_TYPE scheduleRepeatType,SCHEDULE_STATUS scheduleStatus" +
                " from gtd_schedule where SCHEDULE_ID = " + id;

        return (ScheduleOutDto) em.createNativeQuery(sql).getSingleResult();
    }


    public GtdScheduleEntity findByScheduleId(String name) {

        String sql = "select count(*) from gtd_schedule where SCHEDULE_NAME = " + name;

        return (GtdScheduleEntity) em.createNativeQuery(sql).getSingleResult();
    }
}
