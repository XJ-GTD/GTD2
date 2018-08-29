package com.manager.master.repository;

import com.manager.master.entity.GtdScheduleLabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * 日程标签表 Repository
 * @author cp
 * @since 2018/8/29
 */
@Transactional
public interface CenterScheduleLabelRepository extends JpaRepository<GtdScheduleLabelEntity, Integer> {
}
