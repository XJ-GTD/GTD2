package com.manager.master.repository;

import com.manager.master.entity.GtdGroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 *群组实现类
 */
@Transactional
public interface GroupJpaRepository extends JpaRepository<GtdGroupEntity,Integer> {
    List<GtdGroupEntity> findByGroupName(String groupName);
}
