package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdDictionaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 字典表DAO层 继承类
 *
 * create by wzy on 2018/12/21
 */
@Transactional
public interface GtdDictionaryRepository extends JpaRepository<GtdDictionaryEntity, Integer> {

    /**
     * 查询字典类型值
     * @param dictType
     * @return
     */
    List<GtdDictionaryEntity> findAllByDictType(String dictType);
}
