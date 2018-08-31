package com.manager.master.repository;

import com.manager.master.entity.GtdGroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

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
     *根据群组ID查询群组
     * @param list
     * @return
     */
    List<GtdGroupEntity> findByGroupIdIn(List<Integer> list);


//    @Modifying
//    @Query("update GtdGroupEntity g set g.groupName=:groupName")
//    int updateGroupName(String groupName);

    //List<GtdGroupEntity> findByUserIdOrGroupName();

}

