package com.manager.master.repository;

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
}
