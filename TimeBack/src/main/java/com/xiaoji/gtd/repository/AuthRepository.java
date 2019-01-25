package com.xiaoji.gtd.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * 验证类DAO层 注解类
 *
 * create by wzy on 2018/11/21
 */
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
            sqlScreen = " WHERE LOGIN_NAME = '" + account + "' AND LOGIN_TYPE IN ('" + LOGIN_TYPE_ACCOUNT + "','" + LOGIN_TYPE_MOBILE + "')";
        } else {
            sqlScreen = " WHERE LOGIN_NAME = '"+ account + "' AND LOGIN_TYPE = '" + LOGIN_TYPE_MOBILE + "'";
        }

        String sql = "SELECT TA.USER_ID, TB.USER_NAME, TB.HEAD_IMG, TB.BIRTHDAY, TB.REAL_NAME, TB.ID_CARD, TB.USER_SEX, TA.PASSWORD \n" +
                " FROM gtd_login TA \n" +
                " INNER JOIN gtd_user TB ON TB.USER_ID = TA.USER_ID " + sqlScreen;

        return em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 接受推送权限查询
     * @return
     */
    public Object isAcceptThePush(String userId, String targetUserId, String targetMobile) {

        String sqlQuery = " WHERE TB.LOGIN_TYPE = '" + LOGIN_TYPE_MOBILE + "' AND TB.LOGIN_NAME = '" + targetMobile + "' \n";
        if (targetUserId != null && !targetUserId.equals("")) {
            sqlQuery += " AND TB.USER_ID = '" + targetUserId + "' \n";
        }

        String sql = "SELECT TB.USER_ID, TA.PLAYER_FLAG  FROM gtd_login TB \n" +
                " LEFT JOIN gtd_player TA ON TA.USER_ID = TB.USER_ID \n" +
                " AND TA.PLAYER_ID = '" + userId + "'\n" +
                sqlQuery;

        return em.createNativeQuery(sql).getSingleResult();
    }

}
