package com.xiaoji.gtd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.entity.GtdScheduleCEntity;

/**
 * 日程事件子表(任务)DAO层 继承类
 *
 * create by wzy on 2019/01/07
 */
@Transactional
public interface GtdScheduleCRepository extends JpaRepository<GtdScheduleCEntity, Integer> {

    /**
     * 查询用户下全部日程事件子表数据
     * @return
     */
    @Query(value = "SELECT * FROM gtd_schedule_c TA INNER JOIN gtd_schedule TB ON TB.SCHEDULE_ID = TA.SCHEDULE_ID WHERE TB.USER_ID = ?1", nativeQuery = true)
    List<GtdScheduleCEntity> findAllByUserId(String userId);

    /**
     * 根据主键查询详细数据
     * @param id
     * @return
     */
    GtdScheduleCEntity findById(String id);

    @Query(value = "SELECT * FROM gtd_schedule_c WHERE ID IN ?1", nativeQuery = true)
    List<GtdScheduleCEntity> findByIds(List<String> ids);
}
