package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdLoginEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

/**
 * 登陆方式表DAO层 继承类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
public interface GtdLoginRepository extends JpaRepository<GtdLoginEntity,Integer> {

    /*@Modifying
    @Query(value = "select count(*) from gtd_login where USER_ID = ?1 and LOGIN_NAME = ?2 and LOGIN_TYPE = '10011'",nativeQuery = true)
    int findByUserId(String userId, String accountMobile);*/
}
