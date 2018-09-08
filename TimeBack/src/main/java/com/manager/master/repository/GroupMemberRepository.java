package com.manager.master.repository;

import com.manager.master.entity.GtdGroupMemberEntity;
import org.hibernate.type.IntegerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 *  群组人员表 Repository
 *  @author cp
 *  @since 2018/8/29
 */
@Transactional
public interface GroupMemberRepository extends JpaRepository<GtdGroupMemberEntity,Integer>{

    @Query(value = "SELECT g FROM gtd_group_member AS g WHERE g.GROUP_ID=?1",nativeQuery = true)
    List<GtdGroupMemberEntity> findMemberByGroupId(int groupId);

    @Query(value = "SELECT g FROM gtd_group_member AS g WHERE g.GROUP_ID=?1 AND g.userId=?2",nativeQuery = true)
    GtdGroupMemberEntity findMemberByGroupIdAndUserId(Integer groupId,Integer userId);


    @Query(value = "SELECT USER_ID FROM gtd_group_member WHERE GROUP_ID = ?1",nativeQuery = true)
    List<Integer> findAllUserIdByGroupId(Integer groupId);
}
