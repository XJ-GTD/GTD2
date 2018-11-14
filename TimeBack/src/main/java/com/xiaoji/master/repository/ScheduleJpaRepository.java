package com.xiaoji.master.repository;

import com.xiaoji.master.entity.GtdScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

/**
 *  日程事件表实现类
 *  @author cp
 *  @since 2018/8/24
 */
@Transactional
public interface ScheduleJpaRepository extends JpaRepository<GtdScheduleEntity,Integer> {
    GtdScheduleEntity findByScheduleId(Integer schedule);

    @Modifying
    @Query(value="UPDATE gtd_schedule SET SCHEDULE_NAME = ?1,SCHEDULE_STARTTIME = ?2,SCHEDULE_DEADLINE = ?3,UPDATE_DATE = ?4,UPDATE_ID = ?5 WHERE SCHEDULE_ID = ?6",nativeQuery=true)
    void updateScheduleByScheduleid(String scheduleName, Timestamp scheduleStartDate, Timestamp scheduleEndDate, Timestamp scheduleUpdate,Integer scheduleUpId,Integer scheduleId);

    @Modifying
    @Query(value = "SELECT SCHEDULE_STARTTIME FROM gtd_schedule WHERE SCHEDULE_ID = ?1",nativeQuery = true)
    String findschedulStartT(Integer scheduleId);
}
