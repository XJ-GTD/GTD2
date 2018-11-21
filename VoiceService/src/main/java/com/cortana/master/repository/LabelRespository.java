package com.xiaoji.master.repository;

import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

/**
 * 标签实现类
 */
@Transactional
@Repository
public class LabelRespository {
    @PersistenceContext
    private EntityManager em;

    public int findByName(String name) {

        String sql = "select label_id from gtd_label where label_name="+name;

        return (int) em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 查询全部标签
     * @param userId
     * @param findType 0：日程全部标签  1：参与人全部标签
     * @return
     */
    public List findLabelList(int userId, int findType) {
        String sql = "SELECT LABEL_ID, LABEL_NAME" +
                " FROM gtd_label" +
                " WHERE LABEL_TYPE = " + findType;

        return em.createNativeQuery(sql).getResultList();
    }

    /**
     *  通过 日程ID 查询相关 标签名
     * @param scheduleId
     * @return
     */
    public List<String> findLabelNameByScheduleId(Integer scheduleId){
        String sql = "SELECT\n" +
                "label_table.LABEL_NAME\n" +
                "FROM gtd_label label_table\n" +
                "LEFT JOIN gtd_schedule_label sche_label\n" +
                "ON label_table.LABEL_ID = sche_label.LABEL_ID\n" +
                "WHERE sche_label.SCHEDULE_ID = "+scheduleId;
        return (List<String>) em.createNativeQuery(sql).getResultList();
    }

    /**
     * 根据 日程事件ID 查询 中间表自增ID、标签ID
     * @param scheduleId
     * @return
     */
    public List<Object[]> findLabelIdByScheduleId(Integer scheduleId){
        String sql = "SELECT SCHEDULE_LABEL_ID,LABEL_ID FROM gtd_schedule_label WHERE SCHEDULE_ID =" + scheduleId;
        return em.createNativeQuery(sql).getResultList();
    }
}
