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
    public Object authLogin(String account, String password) {

        String sqlScreen = "";
        if (password != null && !password.equals("")) {
            sqlScreen = " WHERE LOGIN_NAME = '" + account + "' AND PASSWORD = '" + password + "' AND LOGIN_TYPE IN ('" + LOGIN_TYPE_ACCOUNT + "','" + LOGIN_TYPE_MOBILE + "')";
        } else {
            sqlScreen = " WHERE LOGIN_NAME = '"+ account + "' AND LOGIN_TYPE = '" + LOGIN_TYPE_MOBILE + "'";
        }

        String sql = "SELECT COUNT(*), TB.USER_ID, TB.USER_NAME, TB.HEAD_IMG, TB.BIRTHDAY, TB.REAL_NAME, TB.ID_CARD, TB.USER_SEX \n" +
                " FROM gtd_login TA \n" +
                " INNER JOIN gtd_user TB ON TB.USER_ID = TA.USER_ID " + sqlScreen;

        return em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 接受推送权限查询
     * @return
     */
    public Object isAcceptThePush(String userId, String targetUserId, String targetMobile) {

        String sqlQuery = " WHERE TA.PLAYER_ID = '" + userId + "' \n";
        if (targetMobile != null && !targetMobile.equals("")) {
            sqlQuery += " AND TB.LOGIN_TYPE = '" + LOGIN_TYPE_MOBILE + "' AND LOGIN_NAME = '" + targetMobile + "' \n";
        }
        if (targetUserId != null && !targetUserId.equals("")) {
            sqlQuery += " AND TB.USER_ID = '" + targetUserId + "' ";
        }

        String sql = "SELECT COUNT(*), TA.PLAYER_FLAG, TB.USER_ID FROM gtd_player TA \n" +
                " INNER JOIN gtd_login TB ON TB.USER_ID = TA.USER_ID \n" +
                sqlQuery;

        return em.createNativeQuery(sql).getSingleResult();
    }

}
