package com.manager.master.repository;

import com.manager.master.dto.RemindOutDto;
import com.manager.master.entity.GtdSchedulePlayersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

/**
 *  提醒时间表 相关
 *  @author myx
 *  @since 2018/09/05
 */
@Transactional
public interface RemindJpaRepository extends JpaRepository<GtdSchedulePlayersEntity,Integer> {

    /**
     * 更新 提醒时间表- 日程提醒时间
     * @param reminddate
     * @param userid
     * @param updateDt
     * @param remindId
     */
    @Modifying
    @Query(value = "UPDATE gtd_remind SET REMIND_DATE = ?1,UPDATE_ID = ?2,UPDATE_DATE = ?3 WHERE REMIND_ID = ?4",nativeQuery = true)
    void updateRemindDate(Timestamp reminddate,Integer userid,Timestamp updateDt,Integer remindId);

    /**
     * 根据 参与人表ID 查询 提醒时间ID
     * @param playersId
     * @return
     */
    @Modifying
    @Query(value = "SELECT REMIND_ID FROM gtd_remind WHERE PLAYERS_ID = ?1 ORDER BY REMIND_DATE DESC ",nativeQuery = true)
    List<Integer> findAllRemindIdByPlayersId(Integer playersId);

    /**
     * 根据 参与人ID 删除 提醒时间表数据
     * @param playersId
     */
    @Modifying
    @Query(value = "DELETE FROM gtd_remind WHERE PLAYERS_ID = ?1",nativeQuery = true)
    void deleteAllByPlayersId(Integer playersId);

    /**
     * 插入提醒时间
     * @param playersId
     * @param remindDate
     * @param userid
     * @param createDt
     * @param updateId
     * @param updateDt
     */
    @Modifying
    @Query(value = "INSERT INTO gtd_remind(PLAYERS_ID,REMIND_DATE,REMIND_TYPE,CREATE_ID,CREATE_DATE,UPDATE_ID,UPDATE_DATE) VALUES (?1,?2,?3,?4,?5,?6,?7)",nativeQuery = true)
    void insertIntoRemind(Integer playersId,Timestamp remindDate,Integer remindType,Integer userid,Timestamp createDt,Integer updateId,Timestamp updateDt);

    /**
     * 根据参与人ID删除 提醒时间表数据
     * @param playersId
     */
    @Modifying
    @Query(value = "DELETE FROM gtd_remind WHERE PLAYERS_ID IN ?1",nativeQuery = true)
    void deleteAllByPlayersIds(List<Integer> playersId);

    /**
     * 根据 参与人ID + 日程ID 查询 提醒时间ID + 提醒时间
     * @param userId
     * @param scheduleId
     * @return
     */
    @Modifying
    @Query(value = "SELECT remind_table.REMIND_ID remindId,remind_table.REMIND_DATE remindDate FROM gtd_remind remind_table LEFT JOIN gtd_schedule_players players_table ON remind_table.PLAYERS_ID = players_table.PLAYERS_ID WHERE players_table.USER_ID = ?1 AND players_table.SCHEDULE_ID = ?2",nativeQuery = true)
    List<RemindOutDto> findRemindByUserIDAndScheId(Integer userId,Integer scheduleId);
}
