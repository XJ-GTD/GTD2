package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * 用户类DAO层 继承类
 *
 * create by wzy on 2019/01/21
 */
public interface GtdPersonRepository extends JpaRepository<GtdUserEntity, Integer> {

    /**
     * 查询目标用户
     * (手机号查询）
     * @return
     */
    @Query(value = "SELECT TA.USER_ID, TB.USER_NAME, TB.HEAD_IMG FROM gtd_login TA " +
            " INNER JOIN gtd_user TB ON TB.USER_ID = TA.USER_ID " +
            " WHERE TA.LOGIN_TYPE = ?2 AND TA.LOGIN_NAME IN ?1", nativeQuery = true)
    List<Object> searchUserByMobile(List<String> mobileList, String type);
}
