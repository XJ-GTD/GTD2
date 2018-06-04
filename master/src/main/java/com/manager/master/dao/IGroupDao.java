package com.manager.master.dao;

import com.manager.master.dto.GroupOutDto;
import org.apache.ibatis.annotations.*;

import java.util.List;
@Mapper
public interface IGroupDao {
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
    /**
     * 查询个人群组信息
     * @return
     */
    //<script>select * from user <if test=\"id !=null \">where id = #{id} </if></script>
    @Select(" select  " +
            " GG.GROUP_ID, GG.USER_ID groupMasterId ,gg.ROLE_ID, gg.GROUP_NAME, " +
            " GG.GROUP_HEADIMG, GM.USER_NAME groupMaster" +
            " GS.SCHEDULE_NAME,GS.SCHEDULE_CREATE_DATE, GU.USER_NAME issuerName " +
            " FROM GTD_GROUP GG " +
            " LEFT JOIN gtd_user GM ON GM.USER_ID = GG.USER_ID  " +
            " LEFT JOIN  " +
            " ( SELECT  " +
            " GROUP_ID,SCHEDULE_NAME,SCHEDULE_CREATE_DATE, SCHEDULE_ISSUER" +
            " FROM gtd_schedule  " +
            " group by GROUP_ID  " +
            " ORDER BY SCHEDULE_CREATE_DATE DESC   ) GS  " +
            " ON GS.GROUP_ID = GG.GROUP_ID  " +
            " LEFT JOIN gtd_user GU ON GS.SCHEDULE_ISSUER = GU.USER_ID  " +
            " where gg.user_id = #{userId} ")
    List<GroupOutDto> findGroup(@Param("userId") int userId);


}
