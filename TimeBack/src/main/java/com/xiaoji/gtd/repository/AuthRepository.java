package com.xiaoji.gtd.repository;

import org.springframework.beans.factory.annotation.Value;
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

    @Value("${person.signup.logintype.mobile}")
    private String LOGIN_TYPE_MOBILE;
    @Value("${person.signup.logintype.account}")
    private String LOGIN_TYPE_ACCOUNT;

    /**
     * 登陆验证
     * @return
     */
    public Object authLogin(String account, String password, String accountMobile, String type) {

        String sqlScreen = "";
        if (type.equals(LOGIN_TYPE_ACCOUNT)) {
            sqlScreen = " WHERE LOGIN_NAME = '" + account + "' AND PASSWORD = '" + password + "' AND LOGIN_TYPE = '" + type + "'";
        } else if (type.equals(LOGIN_TYPE_MOBILE)) {
            sqlScreen = " WHERE LOGIN_NAME = '"+ accountMobile + "' AND LOGIN_TYPE = '" + type + "'";
        }

        String sql = "SELECT COUNT(*), USER_ID, USER_NAME, HEAD_IMG, BIRTHDAY, REAL_NAME, ID_CARD, USER_SEX \n" +
                " FROM gtd_login TA \n" +
                " INNER JOIN gtd_user TB ON TB.USER_ID = TA.USER_ID " + sqlScreen;

        return em.createNativeQuery(sql).getSingleResult();
    }

}
