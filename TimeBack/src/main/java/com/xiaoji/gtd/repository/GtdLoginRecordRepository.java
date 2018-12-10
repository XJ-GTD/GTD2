package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdLoginRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * 登陆记录表DAO层 继承类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
public interface GtdLoginRecordRepository extends JpaRepository<GtdLoginRecordEntity,Integer> {
}
