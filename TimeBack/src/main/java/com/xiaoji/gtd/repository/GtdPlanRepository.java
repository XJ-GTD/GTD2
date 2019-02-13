package com.xiaoji.gtd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.entity.GtdPlanEntity;

/**
 * 计划表DAO层 继承类
 *
 * create by wzy on 2019/01/07
 */
@Transactional
public interface GtdPlanRepository extends JpaRepository<GtdPlanEntity, Integer> {

    /**
     * 查询用户下全部计划数据
     * @return
     */
    List<GtdPlanEntity> findAllByUserId(String userId);

    /**
     * 根据主键查询详细数据
     * @param id
     * @return
     */
    GtdPlanEntity findByPlanId(String id);

    @Query(value = "SELECT * FROM gtd_plan WHERE PLAN_ID IN ?1", nativeQuery = true)
    List<GtdPlanEntity> findByPlanIds(List<String> ids);
}
