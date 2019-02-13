package com.xiaoji.gtd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.entity.GtdExecuteEntity;

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

    @Query(value = "SELECT * FROM gtd_execute WHERE EXECUTE_ID IN ?1", nativeQuery = true)
    List<GtdExecuteEntity> findByExecuteIds(List<String> ids);
}
