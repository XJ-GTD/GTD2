package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdLabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * 标签表DAO层 继承类
 *
 * create by wzy on 2018/12/21
 */
@Transactional
public interface GtdLabelRepository extends JpaRepository<GtdLabelEntity, Integer> {
}
