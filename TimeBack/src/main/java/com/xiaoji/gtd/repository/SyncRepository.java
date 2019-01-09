package com.xiaoji.gtd.repository;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * 同步类DAO层 注解类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
@Repository
public class SyncRepository {

    @PersistenceContext
    private EntityManager em;

    /**
     * 查询最新的版本号
     * @param userId
     * @return
     */
    public Object findLatestVersion(String userId) {
        String sql = " SELECT MAX(VERSION) FROM gtd_sync_version \n" +
                " WHERE USER_ID = '" + userId + "'";
        return em.createNativeQuery(sql).getSingleResult();
    }
}
