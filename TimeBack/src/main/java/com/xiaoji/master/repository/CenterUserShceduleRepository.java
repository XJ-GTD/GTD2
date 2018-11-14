package com.xiaoji.master.repository;

import com.xiaoji.master.entity.GtdUserScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户日程表 Repository
 * @author cp
 * @since 2018/8/28
 */
@Transactional
public interface CenterUserShceduleRepository extends JpaRepository<GtdUserScheduleEntity, Integer> {

    /**
     *  根据日程事件Id 删除 日程事件中间表
     * @param scheduleId
     */
    @Modifying
    @Query(value="delete from gtd_user_schedule where SCHEDULE_ID=?1",nativeQuery=true)
    void deleteConnectionByScheduleId(Integer scheduleId);

    /**
     *  根据用户Id 删除 日程事件中间表
     * @param userId
     */
    @Modifying
    @Query(value="delete from gtd_user_schedule where USER_ID=?1",nativeQuery=true)
    void deleteConnectionByUserId(Integer userId);
}
