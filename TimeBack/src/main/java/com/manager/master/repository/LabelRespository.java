package com.manager.master.repository;

import com.manager.master.entity.GtdLabelEntity;
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
}
