package com.manager.master.repository;

import com.manager.master.entity.GtdUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

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

}
