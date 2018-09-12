package com.manager.master.repository;

import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

/**
 *  日程参与人表 Repository
 *  @author myx
 *  @since 2018/9/12
 */
@Transactional
@Repository
public class SchedulePlayersNewRepository {

    @PersistenceContext
    private EntityManager em;

    /**
     * 根据 日程ID和用户ID 查询 日程参与人表ID
     * @param scheduleId
     * @param userId
     * @return
     */
    public Integer findPlayersIdByUserIdAndScheduleId(Integer scheduleId,Integer userId){
        String sql = "SELECT " +
                " PLAYERS_ID " +
                " FROM gtd_schedule_players " +
                " WHERE " +
                " SCHEDULE_ID =  " + scheduleId +
                " AND USER_ID = " + userId;

        return  (Integer) em.createNativeQuery(sql).getSingleResult();
    }
}
