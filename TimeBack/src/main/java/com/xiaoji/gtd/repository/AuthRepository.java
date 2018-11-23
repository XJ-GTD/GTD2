package com.xiaoji.gtd.repository;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * 验证类DAO层 注解类
 *
 * create by wzy on 2018/11/21
 */
@Transactional
@Repository
public class AuthRepository {

    @PersistenceContext
    private EntityManager em;

    /**
     * 密码登陆验证
     * @return
     */
    public Object passwordLogin(String account, String password) {
        String sql = "SELECT COUNT(*), USER_ID FROM gtd_login \n" +
                " WHERE LOGIN_NAME = '" + account + "' AND PASSWORD = '" + password + "'";

        return em.createNativeQuery(sql).getSingleResult();
    }

    public Object authCodeLogin(String accountMobile) {
        String sql = "SELECT COUNT(*), USER_ID FROM gtd_login \n" +
                " WHERE LOGIN_NAME = '"+ accountMobile + "'";

        return em.createNativeQuery(sql).getSingleResult();
    }
}
