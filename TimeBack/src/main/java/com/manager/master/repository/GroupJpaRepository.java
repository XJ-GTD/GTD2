package com.manager.master.repository;

import com.manager.master.dto.GroupOutDto;
import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.entity.GtdLabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

/**
 *群组实现类
 */
@Transactional
public interface GroupJpaRepository extends JpaRepository<GtdGroupEntity,Integer> {


    /**
     *根据群组名称查询
     * @param groupName
     * @return
     */
    List<GtdGroupEntity> findByGroupNameIsLike(String groupName);




    /**
     *根据用户Id查询所有的群组
     * @param userId
     * @return
     */
    List<GtdGroupEntity> findByUserId(Integer userId);

    /**
     *根据群组Id查询群组
     * @param groupId
     * @return
     */
    GtdGroupEntity findByGroupId(Integer groupId);

    /**
     *根据用户Id和群组Id查询所有的群组
     * @param userId
     * @param groupId
     * @return
     */
    GtdGroupEntity findByUserIdAndGroupId(Integer userId,Integer groupId);

    /**
     *根据群组ID查询群组
     * @param list
     * @return
     */
    List<GtdGroupEntity> findByGroupIdIn(List<Integer> list);

    /**
     * 更新群组日程事件中间表时间
     * @param userid
     * @param updateDt
     * @param groupid
     * @param scheduleid
     */
    @Modifying
    @Query(value = "UPDATE gtd_group_schedule SET UPDATE_ID = ?1,UPDATE_DATE = ?2 WHERE GROUP_ID = ?3 and SCHEDULE_ID = ?4",nativeQuery = true)
    void updateUpDateByGroupId(Integer userid, Timestamp updateDt,Integer groupid,Integer scheduleid);

    /**
     * 插入群组日程事件中间表
     * @param groupId
     * @param shceduleId
     * @param createId
     * @param createDt
     * @param updateId
     * @param updateDt
     */
    @Modifying
    @Query(value = "INSERT INTO gtd_group_schedule(GROUP_ID,SCHEDULE_ID,CREATE_ID,CREATE_DATE,UPDATE_ID,UPDATE_DATE) VALUES (?1,?2,?3,?4,?5,?6)",nativeQuery = true)
    void insertIntoGroupSchedule(Integer groupId,Integer shceduleId,Integer createId,Timestamp createDt,Integer updateId,Timestamp updateDt);


//    @Modifying
//    @Query("update GtdGroupEntity g set g.groupName=:groupName")
//    int updateGroupName(String groupName);

    //List<GtdGroupEntity> findByUserIdOrGroupName();

    List<GtdGroupEntity> findDistinctByLabelNot(GtdLabelEntity labelEntity);

    List<GtdGroupEntity> findByLabel(GtdLabelEntity labelEntity);

}

