package com.xiaoji.gtd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.entity.GtdScheduleEntity;

/**
 * 日程表DAO层 继承类
 *
 * create by wzy on 2019/01/07
 */
@Transactional
public interface GtdScheduleRepository extends JpaRepository<GtdScheduleEntity, Integer> {

    /**
     * 查询用户下全部联系人数据
     * @return
     */
    List<GtdScheduleEntity> findAllByUserId(String userId);

    /**
     * 根据主键查询详细数据
     * @param id
     * @return
     */
    GtdScheduleEntity findByScheduleId(String id);

    @Query(value = "SELECT * FROM gtd_schedule WHERE SCHEDULE_ID IN ?1", nativeQuery = true)
    List<GtdScheduleEntity> findByScheduleIds(List<String> ids);
}
