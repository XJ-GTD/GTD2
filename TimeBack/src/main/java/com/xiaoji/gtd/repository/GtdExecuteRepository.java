package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdExecuteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 日程参与人表DAO层 继承类
 *
 * create by wzy on 2019/01/07
 */
@Transactional
public interface GtdExecuteRepository extends JpaRepository<GtdExecuteEntity, Integer> {

    /**
     * 查询用户下全部日程参与人数据
     * @return
     */
    List<GtdExecuteEntity> findAllByUserId(String userId);

    /**
     * 根据主键查询详细数据
     * @param id
     * @return
     */
    GtdExecuteEntity findByExecuteId(String id);
}
