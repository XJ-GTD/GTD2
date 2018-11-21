package com.xiaoji.master.repository;

import org.springframework.data.jpa.repository.JpaRepository;
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
    /**
     * 根据groupID查询GroupMemberEntity
     * @param groupId
     * @return
     */
    @Query(value = "SELECT GROUP_MEMBER_ID,GROUP_ID,USER_ID,USER_NAME,USER_CONTACT,GROUP_MEMBER_STATUS,CREATE_ID,CREATE_DATE,UPDATE_ID,UPDATE_DATE FROM gtd_group_member WHERE GROUP_ID=?1",nativeQuery = true)
    List<GtdGroupMemberEntity> findMemberByGroupId(int groupId);

    /**
     * 根据groupID和userID查询GroupMemberEntity
     * @param groupId
     * @param userId
     * @return
     */
    @Query(value = "SELECT GROUP_MEMBER_ID,GROUP_ID,USER_ID,USER_NAME,USER_CONTACT,GROUP_MEMBER_STATUS,CREATE_ID,CREATE_DATE,UPDATE_ID,UPDATE_DATE FROM gtd_group_member WHERE GROUP_ID=?1 AND USER_ID=?2",nativeQuery = true)
    GtdGroupMemberEntity findMemberByGroupIdAndUserId(Integer groupId,Integer userId);


    /**
     * 根据groupId查询userId
     * @param groupId
     * @return
     */
    @Query(value = "SELECT USER_ID FROM gtd_group_member WHERE GROUP_ID = ?1",nativeQuery = true)
    List<Integer> findAllUserIdByGroupId(Integer groupId);

    /**
     * 根据userId和groupId删除群成员
     * @param userId
     * @param groupId
     */
    @Modifying
    @Query(value = "DELETE FROM gtd_group_member WHERE USER_ID=?1 AND GROUP_ID=?2",nativeQuery = true)
    void deleteGroupMember(int userId,int groupId);
}
