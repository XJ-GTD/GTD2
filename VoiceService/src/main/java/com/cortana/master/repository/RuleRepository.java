package com.xiaoji.master.repository;


import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

@Transactional
@Repository
public class RuleRepository {
    @PersistenceContext
    private EntityManager em;
}
