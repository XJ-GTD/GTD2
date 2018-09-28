package com.manager.master.repository;

import com.manager.master.entity.GtdUserEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

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

    /**
     * 用户登录
     * @param loginType
     * @param accountName 登陆名 根据登陆类型不同值不同
     * @param accountPassword
     * @return
     */
    public Object login(int loginType, String accountName, String accountPassword) {
        String condition = "";
        if (loginType == 0) {
            condition = " AND B.ACCOUNT_PASSWORD = '" + accountPassword + "' AND (B.ACCOUNT_MOBILE = '" + accountName + "' OR B.ACCOUNT_NAME = '" + accountName + "')";
        } else if (loginType == 1) {
            condition = " AND B.ACCOUNT_WECHAT = " + accountName;
        } else if (loginType == 2) {
            condition = " AND B.ACCOUNT_QQ = " + accountName;
        }

        String sql = "SELECT A.USER_ID, A.USER_NAME, A.HEADIMG_URL, A.BRITHDAY, A.USER_SEX, " +
                "A.USER_CONTACT, B.ACCOUNT_NAME, B.ACCOUNT_MOBILE, B.ACCOUNT_QQ, B.ACCOUNT_QUEUE, " +
                "B.ACCOUNT_WECHAT, B.ACCOUNT_UUID " +
                " FROM gtd_account B " +
                " INNER JOIN gtd_user A ON B.USER_ID = A.USER_ID " + condition;


        return em.createNativeQuery(sql).getSingleResult();
    }

    public Object findByMobile(String mobile) {

        String sql = "select count(*) from GTD_ACCOUNT where ACCOUNT_MOBILE = " + mobile;

        return em.createNativeQuery(sql).getSingleResult();
    }

    /**
     *  通过 用户ID 查找 用户名
     * @param userId
     * @return
     */
    public String findUserNameByUserId(Integer userId){
        String sql = "SELECT USER_NAME FROM gtd_user WHERE USER_ID = " + userId;
        return (String) em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 通过 用户ID 查找 密码
     * @param userId
     * @return
     */
    public String findPasswordByUserId(Integer userId){
        String sql = "select ACCOUNT_PASSWORD from gtd_account where USER_ID = " + userId;
        return (String) em.createNativeQuery(sql).getSingleResult();
    }

}
