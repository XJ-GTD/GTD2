package com.xiaoji.gtd.repository;

import com.xiaoji.util.BaseUtil;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * 用户类DAO层 注解类
 *
 * create by wzy on 2018/11/20
 */
@Repository
public class PersonRepository {

    @PersistenceContext
    private EntityManager em;

    /**
     * 查询手机号是否已注册
     * @param mobile
     * @return
     */
    public Object findByMobile(String mobile) {
        String sql = "SELECT COUNT(*) FROM gtd_login WHERE LOGIN_NAME = '" + mobile + "'";

        return em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 查询uuid是否已注册
     * @param uuid
     * @return
     */
    public Object findByUuid(String uuid) {
        String sql = "SELECT COUNT(*) FROM gtd_account WHERE USER_ID = '" + uuid + "'";

        return em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 查询密码是否正确
     * @return
     */
    public Object isPasswordTrue(String userId, String password) {
        String sql = "SELECT COUNT(*) FROM gtd_login WHERE USER_ID = '" + userId + "' AND \n" +
                " PASSWORD = '"+ password + "'";
        return em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 查询目标用户
     * (手机号查询）
     * @return
     */
    public Object searchUserByMobile(String accountMobile, String type) {
        String sql = "SELECT TA.USER_ID, TB.USER_NAME, TB.HEAD_IMG \n" +
                " FROM gtd_login TA \n" +
                " INNER JOIN gtd_user TB ON TB.USER_ID = TA.USER_ID \n" +
                " WHERE TA.LOGIN_TYPE = '" + type + "' AND TA.LOGIN_NAME = '" + accountMobile +"'";
        return em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 查询用户
     * (userId查询)
     * @return
     */
    public Object searchUserById(String userId) {
        String sql = "SELECT TB.USER_NAME, TB.HEAD_IMG, TA.LOGIN_NAME \n" +
                " FROM gtd_login TA \n" +
                " INNER JOIN gtd_user TB ON TB.USER_ID = TA.USER_ID \n" +
                " WHERE TA.LOGIN_TYPE = '10011' AND TB.USER_ID = '"+ userId + "'";
        return em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 更新密码
     * @param userId
     * @param password
     * @return
     */
    public Object updatePassword(String userId, String password) {
        String sql = "UPDATE gtd_login \n" +
                " SET PASSWORD = '" + password + "', CREATE_ID = '" + userId + "', CREATE_DATE = " + BaseUtil.getSqlDate() + " \n" +
                " WHERE USER_ID = '" + userId + "'";
        return em.createNativeQuery(sql).getSingleResult();
    }

}
