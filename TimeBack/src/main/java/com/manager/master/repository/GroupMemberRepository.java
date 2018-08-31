package com.manager.master.repository;

import com.manager.master.entity.GtdGroupMemberEntity;
import org.hibernate.type.IntegerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 *  群组人员表 Repository
 *  @author cp
 *  @since 2018/8/29
 */
@Transactional
public interface GroupMemberRepository extends JpaRepository<GtdGroupMemberEntity,Integer>,JpaSpecificationExecutor<GtdGroupMemberEntity> {
    List<GtdGroupMemberEntity> findAllByGroupId(int groupId);

    GtdGroupMemberEntity findByGroupIdAndUserId(Integer groupId,Integer userId);


    List<GtdGroupMemberEntity> findByUserIdAndGroupId(int userId,int groupId);

    List<GtdGroupMemberEntity> findByUserNameLike(String userName);
}
