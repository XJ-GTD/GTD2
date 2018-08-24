package com.manager.master.repository;

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

    public GtdScheduleEntity findByName(String name) {

        String sql = "select count(*) from gtd_schedule where SCHEDULE_NAME = " + name;

        return (GtdScheduleEntity) em.createNativeQuery(sql).getSingleResult();
    }
}
