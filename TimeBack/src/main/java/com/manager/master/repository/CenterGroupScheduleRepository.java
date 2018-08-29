package com.manager.master.repository;

import com.manager.master.entity.GtdGroupScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 群组日程表 Repository
 * @author cp
 * @since 2018/8/29
 */
public interface CenterGroupScheduleRepository extends JpaRepository<GtdGroupScheduleEntity, Integer> {

}
