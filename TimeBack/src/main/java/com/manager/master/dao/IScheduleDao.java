package com.manager.master.dao;

import com.manager.master.dto.ScheduleOutDto;
import org.apache.ibatis.annotations.*;

import java.util.Date;
import java.util.List;

/**
 * create by zy on 2018/05/04.
 * 日程管理
 */
@Mapper
public interface IScheduleDao {

    /**
     * 查询个人日程信息
     * @return
     */
    @Select("select gs.*,ges.* FROM gtd_schedule gs inner join gtd_executor_schedule ges \n" +
            "on gs.SCHEDULE_ID=ges.SCHEDULE_ID " +
            "where ges.USER_ID = #{scheduleExecutor}")
    List<ScheduleOutDto> findSchedule(@Param("scheduleExecutor") int scheduleExecutor);
    /**
     * 添加个人日程
     * @return
     */
    @Select("INSERT INTO gtd.gtd_schedule (" +
            "`SCHEDULE_NAME`, `SCHEDULE_DETAIL`, `SCHEDULE_ISSUER`,`SCHEDULE_CREATE_DATE`,`SCHEDULE_START_DATE`,`SCHEDULE_FINISH_DATE`,`SCHEDULE_END_DATE`,`SCHEDULE_STATE`, " +
            "`GROUP_ID`,`SCHEDULE_MAP`, `SCHEDULE_REMIND_DATE`,`SCHEDULE_REMIND_REPEAT`,`SCHEDULE_REMIND_REPEAT_TYPE`) " +
            "VALUES (" +
            " #{scheduleName}, #{scheduleDetail}, #{scheduleIssuer},#{scheduleCreateDate}, #{scheduleStartDate},#{scheduleFinishDate},#{scheduleEndDate},#{scheduleState}," +
            "#{groupId},#{scheduleMap},#{scheduleRemindDate},#{scheduleRemindRepeat},#{scheduleRemindRepeatType})")
    ScheduleOutDto createSchedule(@Param("scheduleName") String scheduleName,@Param("scheduleDetail") String scheduleDetail,@Param("scheduleIssuer") int scheduleIssuer,
                                  @Param("scheduleCreateDate") Date scheduleCreateDate,@Param("scheduleStartDate")  Date scheduleStartDate, @Param("scheduleFinishDate")  Date scheduleFinishDate,
                                  @Param("scheduleEndDate")   Date scheduleEndDate,@Param("scheduleState")  String scheduleState,@Param("groupId")  String  groupId,
                                  @Param("scheduleMap")  String scheduleMap,@Param("scheduleRemindDate")  Date scheduleRemindDate,@Param("scheduleRemindRepeat")  String scheduleRemindRepeat,
                                  @Param("scheduleRemindRepeatType")  String  scheduleRemindRepeatType);


    /**
     *获取上次添加日程id
     */
    @Select("SELECT LAST_INSERT_ID()")
    int  selectScheduleId();


    /**
     * 添加执行事件表
     * @return
     */
    @Insert("INSERT INTO gtd.GTD_EXECUTOR_SCHEDULE (" +
            "`USER_ID`, `SCHEDULE_ID`, `EXECUTOR_FINISH_DATE`," +
            "`EXECUTOR_STATE`,`EXECUTOR_REMIND_DATE`,`EXECUTOR_REMIND_REPEAT`," +
            "`EXECUTOR_REMIND_REPEAT_TYPE`) " +
            "VALUES (" +
            " #{userId}, #{scheduleId}, #{executorFinishDate}," +
            "#{scheduleState}, #{executorRemindDate},#{executorRemindRepeat}," +
            "#{executorRemindRepeatType})")


    void createExecutorScheduleId(@Param("userId") int userId,@Param("scheduleId") int  scheduleId,@Param("executorFinishDate") Date executorFinishDate,
                                  @Param("scheduleState") String scheduleState,@Param("executorRemindDate") Date executorRemindDate,@Param("executorRemindRepeat") String executorRemindRepeat,
                                  @Param("executorRemindRepeatType") String executorRemindRepeatType);


    /**
     * 查询单条个人日程信息
     * @return
     */
    @Select("select * FROM gtd_schedule where SCHEDULE_ID = #{scheduleId}")
    ScheduleOutDto findScheduleByOne(@Param("scheduleId") int scheduleId);

    /**
     * 编辑个人日程
     *
     */
    @Update("UPDATE gtd.GTD_SCHEDULE SET " +
            "`SCHEDULE_ID`=#{scheduleId}, " +//事件ID
            "`SCHEDULE_NAME`=#{scheduleName}, " + //事件名
            "`SCHEDULE_DETAIL`=#{scheduleDetail} , " + //事件详情

            "`SCHEDULE_ISSUER`=#{scheduleIssuer} , " + //发布人
            "`SCHEDULE_CREATE_DATE`=#{scheduleCreateDate} , " + //创建时间
            "`SCHEDULE_START_DATE`=#{scheduleStartDate} , " + //开始时间

            "`SCHEDULE_EDIT_DATE`=#{scheduleEditDate} , " + //修改时间
            "`SCHEDULE_FINISH_DATE`=#{scheduleFinishDate} , " + //完成时间
            "`SCHEDULE_END_DATE`=#{scheduleEndDate} , " + //截止时间

            "`SCHEDULE_STATE`=#{scheduleState} , " + //事件状态(-1 未完成 1完成)
            "`GROUP_ID`=#{GroupId} , " + //组群id
            "`SCHEDULE_MAP`=#{scheduleMap} , " + //位置

            "`SCHEDULE_REMIND_DATE`=#{scheduleRemindDate} , " + //提醒时间
            "`SCHEDULE_REMIND_REPEAT`=#{scheduleRemindRepeat} , " + //重复提醒
            "`SCHEDULE_REMIND_REPEAT_TYPE`=#{scheduleRemindRepeatType}  " + //重复提醒类型（1 每日 2 每月 3每年）
            "WHERE `SCHEDULE_ID`=#{scheduleId}")
    void updateSchedule(@Param("scheduleId") int scheduleId,@Param("scheduleName") String scheduleName,@Param("scheduleDetail") String scheduleDetail,
                        @Param("scheduleIssuer") int scheduleIssuer,@Param("scheduleCreateDate") Date scheduleCreateDate,@Param("scheduleStartDate") Date  scheduleStartDate,
                        @Param("scheduleEditDate") Date scheduleEditDate,@Param("scheduleFinishDate") Date scheduleFinishDate,@Param("scheduleEndDate") Date scheduleEndDate,
                        @Param("scheduleState") String scheduleState,@Param("GroupId") String GroupId,@Param("scheduleMap") String scheduleMap,
                        @Param("scheduleRemindDate") Date scheduleRemindDate,@Param("scheduleRemindRepeat") String scheduleRemindRepeat,@Param("scheduleRemindRepeatType") String scheduleRemindRepeatType);

    //DELETE FROM `gtd`.`GTD_SCHEDULE` WHERE `SCHEDULE_ID`='1133';
    /**
     * 删除个人日程信息
     * @return
     */
    @Delete("DELETE FROM gtd.GTD_SCHEDULE WHERE `SCHEDULE_ID`=#{userId}")
    void deleteGroup(@Param("userId") int userId);

    /**
     * 查询一个群组下的所有日程
     * @return
     */
    @Select(" select  " +
            " GS.SCHEDULE_ID, " +
            " GS.SCHEDULE_NAME, " +
            " GS.SCHEDULE_DETAIL, " +
            " GS.SCHEDULE_ISSUER, " +
            " date_format(GS.SCHEDULE_CREATE_DATE,'%Y-%m-%d %T') SCHEDULE_CREATE_DATE, " +
            " GS.SCHEDULE_START_DATE, " +
            " GS.SCHEDULE_EDIT_DATE, " +
            " GS.SCHEDULE_FINISH_DATE, " +
            " GS.SCHEDULE_END_DATE, " +
            " GS.SCHEDULE_STATE, " +
            " GS.GROUP_ID, " +
            " GS.SCHEDULE_MAP, " +
            " GS.SCHEDULE_REMIND_DATE, " +
            " GS.SCHEDULE_REMIND_REPEAT, " +
            " GS.SCHEDULE_REMIND_REPEAT_TYPE " +
            " from gtd_schedule GS  " +
            " where GS.group_id = #{groupId} "  )

    List<ScheduleOutDto> findScheduleByGroup(@Param("groupId") String groupId);

    /**
     * 查询一个群组下的所有日程(关联查询执行人姓名)
     * @return
     */
    @Select(" select  " +
            " GS.SCHEDULE_ID, " +
            " GS.SCHEDULE_NAME, " +
            " GS.SCHEDULE_DETAIL, " +
            " GS.SCHEDULE_ISSUER, " +
            " date_format(GS.SCHEDULE_CREATE_DATE,'%Y-%m-%d %T') SCHEDULE_CREATE_DATE, " +
            " GS.SCHEDULE_START_DATE, " +
            " GS.SCHEDULE_EDIT_DATE, " +
            " GS.SCHEDULE_FINISH_DATE, " +
            " GS.SCHEDULE_END_DATE, " +
            " GS.SCHEDULE_STATE, " +
            " GS.GROUP_ID, " +
            " GS.SCHEDULE_MAP, " +
            " GS.SCHEDULE_REMIND_DATE, " +
            " GS.SCHEDULE_REMIND_REPEAT, " +
            " GS.SCHEDULE_REMIND_REPEAT_TYPE, " +
            " GU.USER_NAME executorName" +
            " from gtd_schedule GS  " +
            " LEFT JOIN GTD_EXECUTOR_SCHEDULE GES ON GS.SCHEDULE_ID = GES.SCHEDULE_ID " +
            " LEFT JOIN GTD_USER GU ON GU.USER_ID = GES.USER_ID " +
            " where group_id = #{groupId} "  )
    List<ScheduleOutDto> findScheduleAndUserName(@Param("groupId") String groupId);
    /**
     * 根据事件ID和执行人ID查询事件表和执行事件表。
     * @return
     */
    @Select(" select " +
            " GS.SCHEDULE_ID,GS.SCHEDULE_NAME,GS.SCHEDULE_DETAIL,GS.SCHEDULE_ISSUER,GU1.USER_NAME scheduleIssuerName," +
            " GS.SCHEDULE_CREATE_DATE,GS.SCHEDULE_START_DATE,GS.SCHEDULE_EDIT_DATE," +
            " GS.SCHEDULE_FINISH_DATE,GS.SCHEDULE_END_DATE,GS.SCHEDULE_STATE," +
            " GS.GROUP_ID,GS.SCHEDULE_MAP,GS.SCHEDULE_REMIND_DATE,GS.SCHEDULE_REMIND_REPEAT," +
            " GS.SCHEDULE_REMIND_REPEAT_TYPE,GES.USER_ID,GES.SCHEDULE_ID,GES.EXECUTOR_FINISH_DATE," +
            " GES.EXECUTOR_STATE,GES.EXECUTOR_REMIND_DATE,GES.EXECUTOR_REMIND_REPEAT,GES.EXECUTOR_REMIND_REPEAT_TYPE," +
            " GES.EXECUTOR_SCHEDULE_NUMBER, GU2.USER_NAME userName" +
            " from gtd_schedule GS" +
            " left join GTD_EXECUTOR_SCHEDULE GES ON GS.SCHEDULE_ID = GES.SCHEDULE_ID" +
            " LEFT JOIN GTD_USER GU2 ON GU2.USER_ID = GES.USER_ID " +
            " left join GTD_USER GU1 ON GU1.USER_ID = GS.SCHEDULE_ISSUER" +
            " WHERE GS.SCHEDULE_ID = #{scheduleId}" +
            " AND GES.USER_ID = #{userId}" )
    ScheduleOutDto findScheduleAndExeBySchIdAndUserId(@Param("scheduleId") int scheduleId,@Param("userId") int userId);

    /**
     * 根据群组ID插入事件（事件表入库）
     * @return
     */
    @Insert(" insert into gtd_schedule (SCHEDULE_NAME,SCHEDULE_DETAIL,SCHEDULE_ISSUER,SCHEDULE_CREATE_DATE,SCHEDULE_START_DATE," +
            " SCHEDULE_EDIT_DATE,SCHEDULE_FINISH_DATE,SCHEDULE_END_DATE,SCHEDULE_STATE,GROUP_ID," +
            " SCHEDULE_MAP,SCHEDULE_REMIND_DATE,SCHEDULE_REMIND_REPEAT,SCHEDULE_REMIND_REPEAT_TYPE)" +
            " values(#{scheduleName},#{scheduleDetail},#{scheduleIssuer},#{scheduleCreateDate},#{scheduleStartDate}," +
            "#{scheduleEditDate},#{scheduleFinishDate},#{scheduleEndDate},#{scheduleState},#{groupId}," +
            "#{scheduleMap},#{scheduleRemindDate},#{scheduleRemindRepeat},#{scheduleRemindRepeatType})" )
    void createSchByGroupId(@Param("scheduleName") String scheduleName,@Param("scheduleDetail") String scheduleDetail,@Param("scheduleIssuer") int scheduleIssuer,
                            @Param("scheduleCreateDate") Date scheduleCreateDate,@Param("scheduleStartDate")  Date scheduleStartDate, @Param("scheduleEditDate")   Date scheduleEditDate, @Param("scheduleFinishDate")  Date scheduleFinishDate,
                            @Param("scheduleEndDate")   Date scheduleEndDate,@Param("scheduleState")  String scheduleState,@Param("groupId")  String  groupId,
                            @Param("scheduleMap")  String scheduleMap,@Param("scheduleRemindDate")  Date scheduleRemindDate,@Param("scheduleRemindRepeat")  String scheduleRemindRepeat,
                            @Param("scheduleRemindRepeatType")  String  scheduleRemindRepeatType);

    /**
     * 添加完群组时间之后通过执行人添加执行事件表
     * @return
     */
    @Insert("INSERT INTO gtd.GTD_EXECUTOR_SCHEDULE (" +
            "`USER_ID`, `SCHEDULE_ID`, `EXECUTOR_FINISH_DATE`," +
            "`EXECUTOR_STATE`,`EXECUTOR_REMIND_DATE`,`EXECUTOR_REMIND_REPEAT`," +
            "`EXECUTOR_REMIND_REPEAT_TYPE`) " +
            "VALUES (" +
            " #{userId}, #{scheduleId}, #{executorFinishDate}," +
            "#{scheduleState}, #{executorRemindDate},#{executorRemindRepeat}," +
            "#{executorRemindRepeatType})")
    void createExecutorScheduleAfterCreateGroupSch(@Param("userId") int userId,@Param("scheduleId") int  scheduleId,@Param("executorFinishDate") String executorFinishDate,
                                  @Param("scheduleState") String scheduleState,@Param("executorRemindDate") String executorRemindDate,@Param("executorRemindRepeat") String executorRemindRepeat,
                                  @Param("executorRemindRepeatType") String executorRemindRepeatType);
    /**
     * 根据事件ID和执行人ID查询事件表和执行事件表。
     * @return
     */
    @Select(" select " +
            " GS.SCHEDULE_ID,GS.SCHEDULE_NAME,GS.SCHEDULE_DETAIL,GS.SCHEDULE_ISSUER,GU1.USER_NAME scheduleIssuerName," +
            " GS.SCHEDULE_CREATE_DATE,GS.SCHEDULE_START_DATE,GS.SCHEDULE_EDIT_DATE," +
            " GS.SCHEDULE_FINISH_DATE,GS.SCHEDULE_END_DATE,GS.SCHEDULE_STATE," +
            " GS.GROUP_ID,GS.SCHEDULE_MAP,GS.SCHEDULE_REMIND_DATE,GS.SCHEDULE_REMIND_REPEAT," +
            " GS.SCHEDULE_REMIND_REPEAT_TYPE,GES.USER_ID,GES.SCHEDULE_ID,GES.EXECUTOR_FINISH_DATE," +
            " GES.EXECUTOR_STATE,GES.EXECUTOR_REMIND_DATE,GES.EXECUTOR_REMIND_REPEAT,GES.EXECUTOR_REMIND_REPEAT_TYPE," +
            " GES.EXECUTOR_SCHEDULE_NUMBER, GU2.USER_NAME userName" +
            " from gtd_schedule GS" +
            " left join GTD_EXECUTOR_SCHEDULE GES ON GS.SCHEDULE_ID = GES.SCHEDULE_ID" +
            " LEFT JOIN GTD_USER GU2 ON GU2.USER_ID = GES.USER_ID " +
            " left join GTD_USER GU1 ON GU1.USER_ID = GS.SCHEDULE_ISSUER" +
            " WHERE GS.SCHEDULE_CREATE_DATE between #{dayStarDate}  and #{dayEndDate} " +
            " AND GES.USER_ID = #{userId}" +
            "order by GS.SCHEDULE_CREATE_DATE asc" )
    List<ScheduleOutDto> createSchByCalendar(@Param("dayStarDate") String dayStarDate,@Param("dayStarDate") String dayEndDate,@Param("userId") int userId);

    /**
     * 通过事件ID和userId编辑执行事件表
     *
     */
    @Update("UPDATE GTD_EXECUTOR_SCHEDULE SET " +
            " USER_ID = #{userId}," +
            " SCHEDULE_ID = #{scheduleId}," +
            " EXECUTOR_FINISH_DATE = #{executorFinishDate}," +
            " EXECUTOR_STATE = #{executorState}," +
            " EXECUTOR_REMIND_DATE = #{executorRemindDate}," +
            " EXECUTOR_REMIND_REPEAT = #{executorRemindRepeat}," +
            " EXECUTOR_REMIND_REPEAT_TYPE = #{executorRemindRepeatType}" +
            "WHERE SCHEDULE_ID = #{scheduleId} and USER_ID = #{userId}")
    void updateScheduleByScheduleIdAndUserId(@Param("userId") String userId,@Param("scheduleId") int scheduleId,@Param("executorFinishDate") String executorFinishDate,
                        @Param("executorState") String executorState,@Param("executorRemindDate") String executorRemindDate,@Param("executorRemindRepeat") String executorRemindRepeat,
                       @Param("executorRemindRepeatType") String executorRemindRepeatType);
//    @Param("scheduleId") int scheduleId,@Param("userId")int userId





}
