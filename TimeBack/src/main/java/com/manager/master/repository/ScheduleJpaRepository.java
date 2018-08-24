package com.manager.master.repository;

import com.manager.master.entity.GtdScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 *  日程事件表实现类
 *  @author cp
 *  @since 2018/8/24
 */
@Transactional
public interface ScheduleJpaRepository extends JpaRepository<GtdScheduleEntity,Integer> {
}
