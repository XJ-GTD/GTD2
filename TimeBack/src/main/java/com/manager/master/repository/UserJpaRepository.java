package com.manager.master.repository;

import com.manager.master.entity.GtdUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

/**
 * 用户实现类
 *
 * create by wzy on 2018/08/22
 */
@Transactional
public interface UserJpaRepository extends JpaRepository<GtdUserEntity, Integer> {

    /**
     * 查询用户的消息队列
     * @param userId
     * @return
     */
    @Query(value = " SELECT ACCOUNT_QUEUE FROM gtd_account WHERE USER_ID = ?1 ", nativeQuery = true)
    String findAccountQueue(int userId);

    /**
     * 修改用户密码
     * @param userId
     * @param newPassword
     */
    @Modifying
    @Query(value = "update gtd_account set ACCOUNT_PASSWORD = ?2,UPDATE_ID = ?3,UPDATE_DATE = ?4 where USER_ID = ?1",nativeQuery = true)
    void updatePassword(Integer userId, String newPassword, Integer updateId, Timestamp updateDt);

}
