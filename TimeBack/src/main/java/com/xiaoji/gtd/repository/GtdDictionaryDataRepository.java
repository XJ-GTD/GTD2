package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdDictionaryDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 字典数据表DAO层 继承类
 *
 * create by wzy on 2018/12/21
 */
@Transactional
public interface GtdDictionaryDataRepository extends JpaRepository<GtdDictionaryDataEntity, Integer> {

    /**
     * 查询某类型下所有字典数据
     * @param dictValue
     * @return
     */
    List<GtdDictionaryDataEntity> findAllByDictValueIn(List<Integer> dictValue);
}
