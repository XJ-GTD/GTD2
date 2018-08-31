package com.manager.master.repository;

import com.manager.master.entity.GtdScheduleLabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

/**
 * 日程标签表 Repository
 * @author cp
 * @since 2018/8/29
 */
@Transactional
public interface CenterScheduleLabelRepository extends JpaRepository<GtdScheduleLabelEntity, Integer> {

    /**
     * 根据日程事件Id 删除 日程标签中间表
     * @param scheduleId
     */
    @Modifying
    @Query(value="delete from gtd_schedule_label where SCHEDULE_ID=?1",nativeQuery=true)
    void deleteConnectionByScheduleId(Integer scheduleId);
}
