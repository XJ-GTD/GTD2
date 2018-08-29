package com.manager.master.repository;

import com.manager.master.entity.GtdSchedulePlayersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 *  日程参与人表 Repository
 *  @author cp
 *  @since 2018/8/29
 */
@Transactional
public interface SchedulePlayersRepository extends JpaRepository<GtdSchedulePlayersEntity,Integer> {
}
