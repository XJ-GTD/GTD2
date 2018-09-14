package com.manager.master.repository;

import com.manager.master.dto.GroupOutDto;
import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.entity.GtdLabelEntity;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 *群组实现类
 */
@Transactional
public interface GroupJpaRepository extends JpaRepository<GtdGroupEntity,Integer> {


    /**
     * 根据群组ID查询群组
     * @param groupId
     * @return
     */
    @Query(value = "SELECT DISTINCT gtd_label.LABEL_NAME,gtd_group.GROUP_NAME,gtd_group.GROUP_HEADIMG_URL,gtd_group_member.USER_ID,gtd_group_member.USER_NAME,gtd_group_member.USER_CONTACT,gtd_group.GROUP_ID,gtd_group.USER_ID,gtd_group.CREATE_ID,gtd_group.CREATE_DATE,gtd_group.UPDATE_ID,gtd_group.UPDATE_DATE,gtd_group_label.LABEL_ID\n" +
            "FROM gtd_group INNER JOIN gtd_group_label ON gtd_group_label.GROUP_ID = gtd_group.GROUP_ID INNER JOIN gtd_group_member ON gtd_group_member.GROUP_ID = gtd_group.GROUP_ID AND gtd_group_member.GROUP_ID = gtd_group.GROUP_ID INNER JOIN gtd_label ON gtd_group_label.LABEL_ID = gtd_label.LABEL_ID " +
            "WHERE  gtd_group.GROUP_ID =?1",nativeQuery = true)
    GtdGroupEntity findGroupByGroupId(Integer groupId);


    /**
     *根据userId获取用户的所有群组ID
     * @param userId
     * @return
     */
    @Query(value ="SELECT GROUP_ID FROM GTD_GROUP WHERE USER_ID=?1" ,nativeQuery = true)
    List<Integer> findGroupIdByUserId(int userId);




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

    /**
     * 查询参与人 群组类型列表
     * @param
     * @return
     */
    @Query(value = "SELECT DISTINCT gtd_label.LABEL_NAME,gtd_group.GROUP_NAME,gtd_group.GROUP_HEADIMG_URL,gtd_group_member.USER_ID,gtd_group_member.USER_NAME,gtd_group_member.USER_CONTACT,gtd_group.GROUP_ID,gtd_group.USER_ID,gtd_group.CREATE_ID,gtd_group.CREATE_DATE,gtd_group.UPDATE_ID,gtd_group.UPDATE_DATE,gtd_group_label.LABEL_ID\n" +
            "FROM gtd_group INNER JOIN gtd_group_label ON gtd_group_label.GROUP_ID = gtd_group.GROUP_ID INNER JOIN gtd_group_member ON gtd_group_member.GROUP_ID = gtd_group.GROUP_ID AND gtd_group_member.GROUP_ID = gtd_group.GROUP_ID INNER JOIN gtd_label ON gtd_group_label.LABEL_ID = gtd_label.LABEL_ID " +
            "WHERE  gtd_group.USER_ID =?1 AND gtd_group_label.LABEL_ID != ?2 " +
            "GROUP BY gtd_group.GROUP_ID",nativeQuery = true)
    List<GtdGroupEntity> findAllGroup(int userId,int labelId);

    /**
     * 查询参与人 个人类型列表
     * @param
     * @return
     */
    @Query(value = "SELECT DISTINCT gtd_label.LABEL_NAME,gtd_group.GROUP_NAME,gtd_group.GROUP_HEADIMG_URL,gtd_group_member.USER_NAME,gtd_group_member.USER_CONTACT,gtd_group.GROUP_ID,gtd_group.USER_ID,gtd_group.CREATE_ID,gtd_group.CREATE_DATE,gtd_group.UPDATE_ID,gtd_group.UPDATE_DATE,gtd_group_label.LABEL_ID\n" +
            "FROM gtd_group INNER JOIN gtd_group_label ON gtd_group_label.GROUP_ID = gtd_group.GROUP_ID INNER JOIN gtd_group_member ON gtd_group_member.GROUP_ID = gtd_group.GROUP_ID AND gtd_group_member.GROUP_ID = gtd_group.GROUP_ID INNER JOIN gtd_label ON gtd_group_label.LABEL_ID = gtd_label.LABEL_ID " +
            "WHERE  gtd_group.USER_ID =?1 AND gtd_group_label.LABEL_ID= ?2",nativeQuery = true)
    List<GtdGroupEntity> findAllSingle(int userId,int labelId);

    /**
     * 查询用户所有参与人
     * @param userId
     * @return
     */
    @Query(value = " SELECT GROUP_ID, GROUP_NAME, USER_ID FROM GTD_GROUP WHERE USER_ID = ?1 ", nativeQuery = true)
    List<Map> findAllPlayers(int userId);

    /**
     * 查询群组所有参与人
     * @param userId
     * @return
     */
    @Query(value = " SELECT USER_ID FROM GTD_GROUP WHERE GROUP_ID = ?1 ", nativeQuery = true)
    List<Integer> findAllUserIdByGroupId(int userId);

    /**
     * 查询用户的消息队列
     * @param userId
     * @return
     */
    @Query(value = " SELECT ACCOUNT_QUEUE FROM gtd_account WHERE USER_ID = ?1 ", nativeQuery = true)
    String findAccountQueue(int userId);

    /**
     * 根据 日程ID 查询 群组信息
     * @param scheduleId
     * @return
     */
    @Query(value = "SELECT group_tabel.GROUP_ID groupId,group_tabel.GROUP_NAME groupName FROM gtd_group group_tabel LEFT JOIN gtd_group_schedule group_sch ON group_tabel.GROUP_ID = group_sch.GROUP_ID WHERE group_sch.SCHEDULE_ID = ?1 ",nativeQuery = true)
    List<GroupOutDto> findGroupByScheduleId(Integer scheduleId);


    /**
     * 根据用户ID查询用户用户名
     * @param userId
     * @return
     */
    @Query(value = "SELECT USER_NAME FROM gtd_user WHERE USER_ID=?1",nativeQuery = true)
    String findUNameByUserId(int userId);

    /**
     * 根据用户ID查询用户用户名
     * @param groupId
     * @return
     */
    @Query(value = "SELECT GROUP_NAME FROM gtd_group WHERE GROUP_ID=?1",nativeQuery = true)
    String findGNameByUserId(int groupId);


    /**
     * 根据群组名模糊查询群组ID
     * @param groupName
     * @return
     */
    @Query(value = "SELECT GROUP_ID FROM gtd_group WHERE GROUP_NAME LIKE %?1% ",nativeQuery = true)
    List<Integer> getGroupIdsForGroupName(String groupName);

    /**
     * 根据标签名模糊查询群组ID
     * @param labelName
     * @return
     */
    @Query(value = "SELECT GROUP_ID FROM gtd_label INNER JOIN gtd_group_label ON gtd_label.LABEL_ID=gtd_group_label.LABEL_ID WHERE LABEL_NAME LIKE %?1% ",nativeQuery = true)
    List<Integer> getGroupIdsForLabelName(String labelName);

    /**
     * 根据用户名模糊查询群组ID
     * @param userName
     * @return
     */
    @Query(value = "SELECT GROUP_ID FROM gtd_group_member WHERE USER_NAME LIKE %?1% ",nativeQuery = true)
    List<Integer> getGroupIdsForUserName(String userName);


}

