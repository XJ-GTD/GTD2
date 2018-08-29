package com.manager.master.repository;

import com.manager.master.entity.GtdGroupMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 *  群组人员表 Repository
 *  @author cp
 *  @since 2018/8/29
 */
@Transactional
public interface GroupMemberRepository extends JpaRepository<GtdGroupMemberEntity,Integer> {
    List<GtdGroupMemberEntity> findAllByGroupId(int groupId);
}
