package com.manager.master.repository;

import com.manager.master.dto.FindScheduleInDto;
import com.manager.master.dto.FindScheduleOutDto;
import com.manager.master.dto.ScheduleOutDto;
import com.manager.master.entity.GtdScheduleEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 *  日程事件表实现类
 *  @author cp
 *  @since 2018/8/24
 */
@Transactional
@Repository
public class ScheduleRepository {

    @PersistenceContext
    private EntityManager em;

    public ScheduleOutDto findByScheduleId(Integer id) {

        String sql = "SELECT SCHEDULE_ID scheduleId,SCHEDULE_NAME scheduleName,SCHEDULE_STARTTIME scheduleStartTime," +
                "SCHEDULE_DEADLINE scheduleDeadline,SCHEDULE_REPEAT_TYPE scheduleRepeatType,SCHEDULE_STATUS scheduleStatus" +
                " from gtd_schedule where SCHEDULE_ID = " + id;

        return (ScheduleOutDto) em.createNativeQuery(sql).getSingleResult();
    }


    public GtdScheduleEntity findByScheduleId(String name) {

        String sql = "select count(*) from gtd_schedule where SCHEDULE_NAME = " + name;

        return (GtdScheduleEntity) em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 查询 日程时间名称 + 创建人ID
     * @param scheduleId
     * @return
     */
    public Object findScheduleNameAndCreateId(Integer scheduleId){
        String sql = "SELECT SCHEDULE_NAME scheduleName,CREATE_ID createId FROM gtd_schedule WHERE SCHEDULE_ID = " + scheduleId;
        return em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 查询自己创建的日程信息
     * @param inDto
     * @return
     */
    public List<Object[]> findSchedule(FindScheduleInDto inDto){
        Integer userId = inDto.getUserId();
        Integer scheduleId = inDto.getScheduleId();
        String scheduleName = inDto.getScheduleName();
        String scheduleStarttime = inDto.getScheduleStartTime();
        String scheduleDeadline = inDto.getScheduleDeadline();
        Integer labelId = inDto.getLabelId();
        String groupName = inDto.getGroupName();
        Integer groupId = inDto.getGroupId();
        String sql = "SELECT DISTINCT\n" +
                "schedule_table.SCHEDULE_ID scheduleId\n" +
                ",schedule_table.SCHEDULE_NAME scheduleName\n" +
                ",schedule_table.SCHEDULE_STARTTIME scheduleStarttime\n" +
                ",schedule_table.SCHEDULE_DEADLINE scheduleDeadline\n" +
                ",schedule_table.SCHEDULE_STATUS scheduleStatus\n" +
                ",schedule_table.SCHEDULE_FINISH_DATE scheduleFinishDate\n" +
                "FROM gtd_schedule schedule_table\n";
        if(labelId != null && !"".equals(labelId)){
            sql += " INNER JOIN gtd_schedule_label label_table\n" +
                    " ON schedule_table.SCHEDULE_ID = label_table.SCHEDULE_ID\n" +
                    " AND label_table.LABEL_ID = "+ labelId;
        }
        if((groupName != null && !"".equals(groupName)) || (groupId != null && groupId != 0 && !"".equals(groupId))){
            sql +=  " INNER JOIN gtd_group_schedule group_table\n" +
                    " ON schedule_table.SCHEDULE_ID = group_table.SCHEDULE_ID\n";

            if(groupId != null && groupId != 0 && !"".equals(groupId)){
                sql += " AND group_table.GROUP_ID = "+ groupId;
            }
            if(groupName != null && !"".equals(groupName)){
                sql += " INNER JOIN gtd_group group_t\n" +
                        " ON group_t.USER_ID = schedule_table.CREATE_ID\n"+
                        " AND group_t.GROUP_NAME like concat('%','"+ groupName +"','%')\n " +
                        " AND group_t.GROUP_ID = group_table.GROUP_ID\n";
            }
        }

        sql += " WHERE schedule_table.CREATE_ID = " + userId;
        if(scheduleId != null && scheduleId != 0 && !"".equals(scheduleId)){
            sql += " AND schedule_table.SCHEDULE_ID = " + scheduleId;
        }
        if(scheduleName != null && !"".equals(scheduleName)){
            sql += " AND schedule_table.SCHEDULE_NAME like concat('%','"+ scheduleName +"','%')";
        }
        if(scheduleStarttime != null && !"".equals(scheduleStarttime)){
            sql += " AND DATE_FORMAT(schedule_table.SCHEDULE_STARTTIME,'%Y-%m-%d %H:%i') >= DATE_FORMAT('"+scheduleStarttime+"','%Y-%m-%d %H:%i')";
        }
        if(scheduleDeadline != null && !"".equals(scheduleDeadline)){
            sql += " AND DATE_FORMAT(schedule_table.SCHEDULE_DEADLINE,'%Y-%m-%d %H:%i') <= DATE_FORMAT('"+scheduleDeadline+"','%Y-%m-%d %H:%i')";
        }
        return em.createNativeQuery(sql).getResultList();
    }

    /**
     * 查询自己参与的日程信息
     * @param inDto
     * @return
     */
    public List<Object[]> findJoinSchedule(FindScheduleInDto inDto){
        Integer userId = inDto.getUserId();
        Integer scheduleId = inDto.getScheduleId();
        String scheduleName = inDto.getScheduleName();
        String scheduleStarttime = inDto.getScheduleStartTime();
        String scheduleDeadline = inDto.getScheduleDeadline();
        Integer labelId = inDto.getLabelId();
        String groupName = inDto.getGroupName();
        Integer groupId = inDto.getGroupId();
        String sql = "SELECT DISTINCT\n" +
                "schedule_table.SCHEDULE_ID scheduleId\n" +
                ",schedule_table.SCHEDULE_NAME scheduleName\n" +
                ",schedule_table.SCHEDULE_STARTTIME scheduleStarttime\n" +
                ",schedule_table.SCHEDULE_DEADLINE scheduleDeadline\n" +
                ",schedule_table.SCHEDULE_STATUS scheduleStatus\n" +
                ",schedule_table.SCHEDULE_FINISH_DATE scheduleFinishDate\n" +
                "FROM gtd_schedule schedule_table\n";
        if(labelId != null && !"".equals(labelId)){
            sql +=  "INNER JOIN gtd_schedule_label label_table\n" +
                    "ON schedule_table.SCHEDULE_ID = label_table.SCHEDULE_ID\n" +
                    " AND label_table.LABEL_ID = "+ labelId;
        }
        sql += " INNER JOIN gtd_schedule_players players_table\n" +
                "ON players_table.SCHEDULE_ID = schedule_table.SCHEDULE_ID\n" +
                "WHERE players_table.USER_ID = "+userId + " AND players_table.PLAYERS_STATUS IN (0,1,2) ";
        if(scheduleId != null && scheduleId != 0 && !"".equals(scheduleId)){
            sql += " AND schedule_table.SCHEDULE_ID = " + scheduleId;
        }
        if(scheduleName != null && !"".equals(scheduleName)){
            sql += " AND schedule_table.SCHEDULE_NAME like concat('%','"+ scheduleName +"','%')";
        }
        if(scheduleStarttime != null && !"".equals(scheduleStarttime) && (scheduleDeadline == null || "".equals(scheduleDeadline))){
            sql += " AND DATE_FORMAT(schedule_table.SCHEDULE_STARTTIME,'%Y-%m-%d %H:%i') >= DATE_FORMAT('"+scheduleStarttime+"','%Y-%m-%d %H:%i')";
        }
        if(scheduleDeadline != null && !"".equals(scheduleDeadline) && (scheduleStarttime == null || "".equals(scheduleStarttime))){
            sql += " AND DATE_FORMAT(schedule_table.SCHEDULE_DEADLINE,'%Y-%m-%d %H:%i') <= DATE_FORMAT('"+scheduleDeadline+"','%Y-%m-%d %H:%i')";
        }
        if (scheduleStarttime != null && !"".equals(scheduleStarttime) && scheduleDeadline != null && !"".equals(scheduleDeadline)) {
            sql += " AND ( DATE_FORMAT(schedule_table.SCHEDULE_STARTTIME,'%Y-%m-%d %H:%i') <= DATE_FORMAT('"+scheduleDeadline+"','%Y-%m-%d %H:%i') AND DATE_FORMAT(schedule_table.SCHEDULE_STARTTIME,'%Y-%m-%d %H:%i') >= DATE_FORMAT('" + scheduleStarttime + "','%Y-%m-%d %H:%i')\n " +
                    " OR \n" +
                    " DATE_FORMAT(schedule_table.SCHEDULE_DEADLINE,'%Y-%m-%d %H:%i') <= DATE_FORMAT('" + scheduleDeadline + "','%Y-%m-%d %H:%i') AND DATE_FORMAT(schedule_table.SCHEDULE_DEADLINE,'%Y-%m-%d %H:%i') >= DATE_FORMAT('" + scheduleStarttime + "','%Y-%m-%d %H:%i'))";
        }
        return  em.createNativeQuery(sql).getResultList();
    }

    /**
     * 通过 日程ID 查找 开始时间
     * @param scheduleId
     * @return
     */
    public String findschedulStartT(Integer scheduleId){
        String  sql = "SELECT SCHEDULE_STARTTIME FROM gtd_schedule WHERE SCHEDULE_ID = " + scheduleId;
        return  em.createNativeQuery(sql).getSingleResult().toString();
    }

    /**
     * 查询用户所有提醒时间
     * @param userId
     * @return
     */
    public List<Object[]> findAllRemindTime(Integer userId, String startTime, String deadline) {
        String sql = " SELECT RM.REMIND_DATE, SS.SCHEDULE_NAME " +
                " FROM gtd_remind RM " +
                " INNER JOIN gtd_schedule_players SP ON RM.PLAYERS_ID = SP.PLAYERS_ID " +
                " INNER JOIN gtd_schedule SS ON SS.SCHEDULE_ID = SP.SCHEDULE_ID " +
                " WHERE DATE_FORMAT(REMIND_DATE,'%Y-%m-%d %H:%i') <= DATE_FORMAT('"+ deadline +"','%Y-%m-%d %H:%i') " +
                " AND DATE_FORMAT(REMIND_DATE,'%Y-%m-%d %H:%i') >= DATE_FORMAT('"+ startTime +"','%Y-%m-%d %H:%i')";

        return em.createNativeQuery(sql).getResultList();
    }
}
