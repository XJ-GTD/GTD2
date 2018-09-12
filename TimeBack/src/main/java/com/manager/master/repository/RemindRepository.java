package com.manager.master.repository;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * 提醒时间表 相关
 */
@Transactional
@Repository
public class RemindRepository {
    @PersistenceContext
    private EntityManager em;

    /**
     * 根据 参与人ID + 日程ID 查询 提醒时间ID + 提醒时间
     * @param userId
     * @param scheduleId
     * @return
     */
    public List<Object[]> findRemindByUserIDAndScheId(Integer userId,Integer scheduleId){
        String sql = "SELECT " +
                "remind_table.REMIND_ID remindId," +
                "remind_table.REMIND_DATE remindDate " +
                "FROM gtd_remind remind_table " +
                "LEFT JOIN gtd_schedule_players players_table " +
                "ON remind_table.PLAYERS_ID = players_table.PLAYERS_ID " +
                "WHERE " +
                " players_table.USER_ID =  " + userId +
                " AND players_table.SCHEDULE_ID = " + scheduleId;
        return em.createNativeQuery(sql).getResultList();
    }
}
