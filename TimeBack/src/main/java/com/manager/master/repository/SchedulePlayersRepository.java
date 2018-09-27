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
    /**
     * 删除 日程 所有参与人
     * @param scheduleId    日程Id
     */
    @Modifying
    @Query(value="delete from gtd_schedule_players where SCHEDULE_ID = ?1 ",nativeQuery=true)
    void deleteConnectionByScheduleId(Integer scheduleId);

    /**
     * 参与人 删除 日程
     * @param scheduleId    日程Id
     * @param userId         参与人Id
     */
    @Modifying
    @Query(value="delete from gtd_schedule_players where SCHEDULE_ID = ?1 AND USER_ID = ?2 ",nativeQuery=true)
    void deleteConnectionByScheduleIdAndUserId(Integer scheduleId,Integer userId);

    /**
     * 修改参与人状态
     * @param status        0是完成，1是未完成，2是过期，3是未接受，-1是拒绝
     * @param updateId      修改用户Id
     * @param updateDate    修改时间
     * @param scheduleId    日程Id
     */
    @Modifying
    @Query(value="UPDATE gtd_schedule_players SET PLAYERS_STATUS = ?1 ,UPDATE_ID = ?2 ,UPDATE_DATE = ?3 where SCHEDULE_ID = ?4 ",nativeQuery=true)
    void updateConnectionByScheduleIdAndUserId(Integer status,Integer updateId,Timestamp updateDate,Integer scheduleId);

    /**
     * 根据事件Id、参与人Id、创建人Id 查询
     * @param scheduleId
     * @param userId
     * @param createId
     * @return
     */
    GtdSchedulePlayersEntity findByScheduleIdAndUserIdAndCreateId(Integer scheduleId,Integer userId,Integer createId);

    /**
     * 查询日程所有参与人
     * @param scheduleId
     * @return
     */
    List<GtdSchedulePlayersEntity> findAllByScheduleId(Integer scheduleId);

    /**
     * 查询日程参与人表ID
     * @param schedulId
     * @return
     */
    @Query(value = "SELECT PLAYERS_ID FROM gtd_schedule_players WHERE SCHEDULE_ID = ?1",nativeQuery = true)
    List<Integer> findAllPlayersId(Integer schedulId);

    /**
     * 根据 日程ID和用户ID 查询 日程参与人表ID
     * @param scheduleId
     * @param userId
     * @return
     */
    @Query(value = "SELECT PLAYERS_ID FROM gtd_schedule_players WHERE SCHEDULE_ID = ?1 AND USER_ID = ?2",nativeQuery = true)
    Integer findPlayersIdByUserIdAndScheduleId(Integer scheduleId,Integer userId);

    /**
     * 根据 日程参与人表ID 删除表数据
     * @param playersId
     */
    @Modifying
    @Query(value = "DELETE FROM gtd_schedule_players WHERE PLAYERS_ID = ?1",nativeQuery = true)
    void deleteSchedulePlayersByPlayersId(Integer playersId);

    /**
     * 插入新数据到日程参与人表
     * @param scheduleId
     * @param playersStatus
     * @param userId
     * @param createId
     * @param createDt
     * @param updateId
     * @param updateDt
     */
    @Modifying
    @Query(value = "INSERT INTO gtd_schedule_players(SCHEDULE_ID,PLAYERS_STATUS,USER_ID,CREATE_ID,CREATE_DATE,UPDATE_ID,UPDATE_DATE) VALUES(?1,?2,?3,?4,?5,?6,?7)",nativeQuery = true)
    void insertSchedulePlayers(Integer scheduleId,Integer playersStatus,Integer userId,Integer createId,Timestamp createDt,Integer updateId,Timestamp updateDt);

    /**
     * 修改日程参与人状态
     * @param userId
     * @param scheduleId
     * @param playersStatus
     */
    @Modifying
    @Query(value = "UPDATE gtd_schedule_players SET PLAYERS_STATUS = ?3,UPDATE_ID = ?4,UPDATE_DATE = ?5 WHERE SCHEDULE_ID = ?2 AND USER_ID = ?1",nativeQuery = true)
    void updatePlayersStatus(Integer userId,Integer scheduleId,Integer playersStatus,Integer updateId,Timestamp updateDt);

}
