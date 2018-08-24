package com.manager.master.repository;

import com.manager.master.entity.GtdAccountEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * 用户实现类
 *
 * create by wzy on 2018/08/22
 */
@Transactional
@Repository
public class UserRepository {

    @PersistenceContext
    private EntityManager em;

    public GtdAccountEntity findByMobile(String mobile) {

        String sql = "select count(*) from GTD_ACCOUNT where ACCOUNT_MOBILE = " + mobile;

        return (GtdAccountEntity) em.createNativeQuery(sql).getSingleResult();
    }
}
