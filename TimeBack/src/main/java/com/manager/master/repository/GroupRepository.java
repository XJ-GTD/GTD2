package com.manager.master.repository;

import com.manager.master.dto.GroupInDto;
import com.manager.master.dto.GroupScheduleInDto;
import com.manager.master.entity.GtdGroupEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;

/**
 * 群组实现类
 */
@Transactional
@Repository
public class GroupRepository {
    @PersistenceContext
    private EntityManager em;


//    public List<GtdGroupEntity> findByUserId(int userId){
//        String sql="";
//    }



    /**
     * 根据群名称模糊查询
     * @param groupName
     * @return
     */
   public List<GtdGroupEntity> findByGroupNameLike(String groupName){
       String sql="select gr from gtd_group gr where GROUP_NAME LIKE '%"+groupName+"%'";
       return (List<GtdGroupEntity>) em.createNativeQuery(sql).getResultList();
   }

    /**
     * 根据标签名查出群组ID
     * @param labelName
     * @return
     */
    public List<Integer> findByLabelLike(String labelName){
        String sql="SELECT GROUP_ID FROM gtd_group_label where LABEL_ID=(select LABEL_ID from gtd_label where LABEL_NAME LIKE '%"+labelName+"%')";
        return (List<Integer>) em.createNativeQuery(sql).getResultList();
    }


    public int  updateGroup(GroupInDto inDto){
        String sql="UPDATE gtd_group SET GROUP_NAME="+inDto.getGroupName()+" WHERE GROUP_ID="+inDto.getGroupId();
        return em.createNativeQuery(sql).executeUpdate();
    }

    /**
     * 根据 日程事件表ID 查询不包含在新群组ID列表里的 自增主键
     * @param list
     * @param scheduleId
     * @return
     */
    public List<Integer> findGroupScheduleIdByScheduleId(List<Integer> list,Integer scheduleId){
        String sql = "SELECT GROUP_SCHEDULE_ID FROM gtd_group_schedule WHERE SCHEDULE_ID = "+scheduleId+" and GROUP_ID not in("+list+")";
        return (List<Integer>) em.createNativeQuery(sql).getResultList();
    }

    /**
     * 根据 日程事件表ID 查询群组ID
     * @param scheduleId
     * @return
     */
    public List<Integer> findGroupIdByScheduleId(Integer scheduleId){
        String sql = "SELECT GROUP_ID FROM gtd_group_schedule WHERE SCHEDULE_ID = " + scheduleId;
        return (List<Integer>) em.createNativeQuery(sql).getResultList();
    }

    /**
     * 根据联系方式查询UserId
     * @param contact
     * @return
     */
    public int  findUserId(String contact){
        String sql="SELECT USER_ID FROM GTD_USER WHERE USER_CONTACT="+contact;
        return (int) em.createNativeQuery(sql).getSingleResult();
    }

}
