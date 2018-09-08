package com.manager.master.repository;

import com.manager.master.dto.LabelOutDto;
import com.manager.master.entity.GtdLabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

/**
 * 标签实现类
 */
@Transactional
public interface LabelJpaRespository extends JpaRepository<GtdLabelEntity,Integer>{

    /**
     * 根据标签id查询标签
     * @param labelId
     * @return
     */
    GtdLabelEntity findGtdLabelEntityByLabelId(int labelId);

    /**
     * 根据类型查询标签列表
     * @param labelType
     * @return
     */
    @Modifying
    @Query(value = " SELECT LABEL_ID, LABEL_NAME FROM GTD_LABEL WHERE LABEL_TYPE = ?1 ", nativeQuery=true)
    List<Map> findLabelList(int labelType);
}
