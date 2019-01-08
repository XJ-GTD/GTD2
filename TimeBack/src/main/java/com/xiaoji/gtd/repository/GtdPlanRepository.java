package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}
