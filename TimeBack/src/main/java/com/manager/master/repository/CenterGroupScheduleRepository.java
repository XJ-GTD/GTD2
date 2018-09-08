package com.manager.master.repository;

import com.manager.master.entity.GtdGroupScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 群组日程表 Repository
 * @author cp
 * @since 2018/8/29
 */
@Transactional
public interface CenterGroupScheduleRepository extends JpaRepository<GtdGroupScheduleEntity, Integer> {

    /**
     * 根据日程事件Id 删除 日程群组中间表
     * @param scheduleId
     */
    @Modifying
    @Query(value="delete from gtd_group_schedule where SCHEDULE_ID=?1",nativeQuery=true)
    void deleteConnectionByScheduleId(Integer scheduleId);

    /**
     * 根据群组Id查询所有日程
     * @param groupId
     * @return
     */
    @Query(value = "SELECT g FROM gtd_group_schedule AS g WHERE g.GROUP_ID=?1",nativeQuery =true )
    List<GtdGroupScheduleEntity> findGroupSchedulesByGroupId(int groupId);
}
