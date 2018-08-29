package com.manager.master.repository;

import com.manager.master.entity.GtdUserShceduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户日程表 Repository
 * @author cp
 * @since 2018/8/28
 */
@Transactional
public interface CenterUserShceduleRepository extends JpaRepository<GtdUserShceduleEntity, Integer> {
    /**
     * 用户关联查询
     * @param id
     * @return
     */
    @Query(value = "select * from gtd_user_shcedule where USER_ID=?1", nativeQuery = true)
    List<GtdUserShceduleEntity> getUserShceduleByUserId(Integer id);

    /**
     * 日程关联查询
     * @param id
     * @return
     */
    @Query(value = "select * from gtd_user_shcedule where SCHEDULE_ID=?1", nativeQuery = true)
    List<GtdUserShceduleEntity> getUserShceduleByScheduleId(Integer id);


    /**
     * 通过用户 user_id 删除关系
     * ① 在 dao 层中加上 @Modifying
     * ② 注意添加 @Transactional，否则 TransactionRequiredException
     * ③ @Transactional 建议还是在 Service 层中加上，不要在 Controller 层中
     */
    @Modifying
    @Query(value="delete from gtd_user_shcedule where USER_ID=?1",nativeQuery=true)
    void deleteConnectionByScheduleId(Integer userId);

    /**
     * 通过日程 schedule_id 删除关系
     * ① 在 dao 层中加上 @Modifying，否则 SQLException
     * ② 注意添加 @Transactional，否则 TransactionRequiredException
     * ③ @Transactional 建议还是在 Service 层中加上，不要在 Controller 层中
     */
    @Modifying
    @Query(value="delete from gtd_user_shcedule where SCHEDULE_ID=?1",nativeQuery=true)
    void deleteConnectionByUserId(Integer scheduleId);

}
