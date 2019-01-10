package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}
