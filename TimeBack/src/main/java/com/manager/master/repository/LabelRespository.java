package com.manager.master.repository;

import com.manager.master.entity.GtdLabelEntity;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

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
}
