package com.xiaoji.gtd.repository;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * 用户类DAO层 注解类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
@Repository
public class PersonRepository {

    @PersistenceContext
    private EntityManager em;

    /**
     * 查询手机号是否已注册
     * @param mobile
     * @return
     */
    public int findByMobile(String mobile) {

        String sql = "SELECT COUNT(*) FROM gtd_login WHERE LOGIN_NAME = " + mobile;

        return (int) em.createNativeQuery(sql).getSingleResult();
    }
}
