package com.manager.master.dao;

import com.manager.master.dto.GroupDto;
import org.apache.ibatis.annotations.*;

import java.util.List;
@Mapper
public interface IGroupDao {
    /**
     * 查询个人群组信息
     * @return
     */
    //<script>select * from user <if test=\"id !=null \">where id = #{id} </if></script>
    @Select(" select  " +
            " GG.GROUP_ID,gg.USER_ID,gg.ROLE_ID,gg.GROUP_NAME, " +
            " gr.ROLE_NAME, GG.GROUP_HEADIMG," +
            " GS.SCHEDULE_NAME,GS.SCHEDULE_CREATE_DATE " +
            " FROM GTD_GROUP GG " +
            " LEFT JOIN gtd_role GR ON gr.ROLE_ID=gg.ROLE_ID  " +
            " LEFT JOIN  " +
            " ( SELECT  " +
            " GROUP_ID,SCHEDULE_NAME,SCHEDULE_CREATE_DATE " +
            " FROM gtd_schedule  " +
            " group by GROUP_ID  " +
            " ORDER BY SCHEDULE_CREATE_DATE DESC   ) GS  " +
            " ON GS.GROUP_ID = GG.GROUP_ID  " +
            " where gg.user_id = #{userId} ")
    List<GroupDto> findGroup(@Param("userId") int userId);
    /**
     * 添加个人群组信息
     * @return
     */
    @Insert("INSERT INTO gtd.gtd_group (`GROUP_ID`, `GROUP_NAME`, `USER_ID`, `ROLE_ID`) " +
            "VALUES ( #{groupId}, #{groupName},#{userId}, #{roleId})")
    void createGroup(@Param("groupId") String groupId,
                     @Param("groupName") String groupName,
                     @Param("userId") int userId,
                     @Param("roleId") int roleId);


}
