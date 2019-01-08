package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdPlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 联系人表DAO层 继承类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
public interface GtdPlayerRepository extends JpaRepository<GtdPlayerEntity, Integer> {

    /**
     * 查询用户下全部联系人数据
     * @return
     */
    List<GtdPlayerEntity> findAllByUserId(String userId);
}
