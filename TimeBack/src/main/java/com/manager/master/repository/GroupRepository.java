package com.manager.master.repository;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * 群组实现类
 */
@Transactional
@Repository
public class GroupRepository {
    @PersistenceContext
    private EntityManager em;
}
