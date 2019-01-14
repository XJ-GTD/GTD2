package com.xiaoji.gtd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户表DAO层 继承类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
public interface GtdUserRepository extends JpaRepository<GtdUserEntity,Integer> {

    /**
     * 查询用户下全部用户信息数据
     * @return
     */
    List<GtdUserEntity> findAllByUserId(String userId);

    /**
     * 根据主键查询详细数据
     * @param id
     * @return
     */
    GtdUserEntity findByUserId(String id);
}
