package com.manager.master.repository;

import com.manager.master.entity.GtdScheduleLabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

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

    /**
     * 根据 日程事件ID 查询 中间表自增ID、标签ID
     * @param scheduleId
     * @return
     */
    @Modifying
    @Query(value = "SELECT SCHEDULE_LABEL_ID,LABEL_ID FROM gtd_schedule_label WHERE SCHEDULE_ID = ?1",nativeQuery = true)
    List<GtdScheduleLabelEntity> findLabelIdByScheduleId(Integer scheduleId);

    /**
     * 更新 日程标签中间表 - 标签ID
     * @param labelId
     * @param userId
     * @param update
     * @param shceduleLabelId
     */
    @Modifying
    @Query(value = "UPDATE gtd_schedule_label SET LABEL_ID = ?1,UPDATE_ID = ?2,UPDATE_DATE = ?3 WHERE SCHEDULE_LABEL_ID = ?4",nativeQuery = true)
    void updateScheduleLabelById(Integer labelId, Integer userId,Timestamp update,Integer shceduleLabelId);

    /**
     * 根据 群组日程时间自增主键 删除数据
     * @param id
     */
    @Modifying
    @Query(value = "DELETE FROM gtd_group_schedule WHERE GROUP_SCHEDULE_ID = ?1",nativeQuery = true)
    void deleteGroupScheduleById(Integer id);
}
