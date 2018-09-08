package com.manager.master.repository;

import com.manager.master.entity.GtdLabelEntity;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

/**
 * 标签实现类
 */
@Transactional
public interface LabelJpaRespository extends JpaRepository<GtdLabelEntity,Integer>{
    @Query(value = "SELECT g FROM gtd_label AS g WHERE g.LABEL_ID=?1",nativeQuery = true)
    GtdLabelEntity findLabelById(int labelId);

}
