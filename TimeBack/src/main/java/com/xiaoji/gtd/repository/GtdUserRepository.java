package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户表DAO层 继承类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
public interface GtdUserRepository extends JpaRepository<GtdUserEntity,Integer> {
}
