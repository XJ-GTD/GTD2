package com.manager.master.repository;

import com.manager.master.entity.GtdSchedulePlayersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

/**
 *  日程参与人表 Repository
 *  @author cp
 *  @since 2018/8/29
 */
@Transactional
public interface SchedulePlayersRepository extends JpaRepository<GtdSchedulePlayersEntity,Integer> {
    @Modifying
    @Query(value="delete from gtd_schedule_players where SCHEDULE_ID=?1",nativeQuery=true)
    void deleteConnectionByScheduleId(Integer scheduleId);

    @Modifying
    @Query(value="delete from gtd_schedule_players where SCHEDULE_ID=?1 AND USER_ID =?2",nativeQuery=true)
    void deleteConnectionByScheduleIdAndUserIdAndCreateId(Integer scheduleId,Integer userId,Integer createId);

    GtdSchedulePlayersEntity findByScheduleIdAndUserIdAndCreateId(Integer scheduleId,Integer userId,Integer createId);

    List<GtdSchedulePlayersEntity> findAllByScheduleId(Integer scheduleId);
}
