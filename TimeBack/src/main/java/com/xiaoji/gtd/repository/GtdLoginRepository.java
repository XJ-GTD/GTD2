package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdLoginEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * 登陆方式表DAO层 继承类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
public interface GtdLoginRepository extends JpaRepository<GtdLoginEntity,Integer> {
}
