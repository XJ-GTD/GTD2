package com.manager.master.repository;

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
    @Query(value = "SELECT REMIND_ID FROM gtd_remind WHERE PLAYERS_ID = ?1",nativeQuery = true)
    List<Integer> findAllRemindIdByPlayersId(Integer playersId);

    @Modifying
    @Query(value = "DELETE FROM gtd_remind WHERE PLAYERS_ID = ?1",nativeQuery = true)
    void deleteAllByPlayersId(Integer playersId);

    @Modifying
    @Query(value = "INSERT INTO gtd_remind(PLAYERS_ID,REMIND_DATE,CREATE_ID,CREATE_DATE,UPDATE_ID,UPDATE_DATE) VALUES (?1,?2,?3,?4,?5,?6)",nativeQuery = true)
    void insertIntoRemind(Integer playersId,Timestamp remindDate,Integer userid,Timestamp createDt,Integer updateId,Timestamp updateDt);
}
