package com.manager.master.repository;

import com.manager.master.dto.GroupInDto;
import com.manager.master.entity.GtdGroupEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
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


    public void updateGroup(GroupInDto inDto){
        String sql="UPDATE gtd_group SET GROUP_NAME="+inDto.getGroupName()+" WHERE GROUP_ID="+inDto.getGroupId();
        em.createNativeQuery(sql).executeUpdate();
    }
}
