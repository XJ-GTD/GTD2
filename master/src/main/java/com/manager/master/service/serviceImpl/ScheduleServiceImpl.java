package com.manager.master.service.serviceImpl;

import com.manager.master.dao.IScheduleDao;
import com.manager.master.dao.IUserDao;
import com.manager.master.dto.PersonScheduleDto;
import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ScheduleOutDto;
import com.manager.master.dto.UserInfoOutDto;
import com.manager.master.service.IGroupService;
import com.manager.master.service.IScheduleService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import javax.annotation.Resource;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * create by zy on 2018/05/05.
 * 日程管理
 */

@Service
@Transactional
public class ScheduleServiceImpl implements IScheduleService {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Resource
    private IScheduleDao scheduleDao;
    @Resource
    private IUserDao userDao;
    @Autowired
    IGroupService IGroupService;
    /**
     * 查询个人日程
     * @param scheduleExecutor
     * @return
     */
    @Override
    public List<ScheduleOutDto> findSchedule(int scheduleExecutor) {
        scheduleDao.findSchedule(scheduleExecutor);
        return scheduleDao.findSchedule(scheduleExecutor);
    }

    /**
     * 添加日程
     * @param inDto
     * @return
     */
    @Override
    public int createSchedule(@RequestBody ScheduleInDto inDto) {
        inDto.setScheduleState("1"); //事件状态SCHEDULE_STATE(-1 拒绝 1未完成)
        DateFormat df2= new SimpleDateFormat("yyyy-MM-dd HH:mm");

        String scheduleName=inDto.getScheduleName();//事件名称
        String scheduleDetail=inDto.getScheduleDetail();//事件详情
        int scheduleIssuer = inDto.getScheduleIssuer();//发布人id
        String scheduleState = inDto.getScheduleState();//事件状态(-1 未完成 1完成)
        String  groupId = inDto.getGroupId();//组群id
        String scheduleMap = inDto.getScheduleMap();//位置

        Date scheduleCreateDate= null;// 创建时间
        Date scheduleStartDate=null;// 开始时间
        Date scheduleFinishDate=null;// 完成时间
        Date scheduleEndDate=null;// 截止时间
        Date scheduleRemindDate=null;//提醒时间
        try {
            if (inDto.getScheduleCreateDate() != null) {
                scheduleCreateDate = df2.parse(inDto.getScheduleCreateDate());
            }
            if (inDto.getScheduleStartDate() != null) {
                scheduleStartDate = df2.parse(inDto.getScheduleStartDate());
            }
            if (inDto.getScheduleFinishDate() != null) {
                scheduleFinishDate = df2.parse(inDto.getScheduleFinishDate());
            }
            if (inDto.getScheduleEndDate() != null) {
                scheduleEndDate = df2.parse(inDto.getScheduleEndDate());
            }
            if (inDto.getScheduleRemindDate() != null) {
                scheduleRemindDate = df2.parse(inDto.getScheduleEndDate());
            }
        } catch (ParseException e) {
            e.printStackTrace();
            return -1;
        }

        String scheduleRemindRepeat = inDto.getScheduleRemindRepeat();//重复提醒
        String scheduleRemindRepeatType = inDto.getScheduleRemindRepeatType();//重复提醒类型SCHEDULE_REMIND_REPEAT_TYPE（1 每日 2 每月 3每年）
        scheduleDao.createSchedule(scheduleName,scheduleDetail,scheduleIssuer,
                scheduleCreateDate,scheduleStartDate,scheduleFinishDate,
                scheduleEndDate,scheduleState,groupId,
                scheduleMap,scheduleRemindDate,scheduleRemindRepeat,
                scheduleRemindRepeatType);

        int  userId = 0;
        int scheduledId = inDto.getScheduleId();         //执行事件IDSCHEDULE_ID
        String userMobile = inDto.getUserId();         //执行人电话（执行人id）String  ,拼写字符串
        Date executorFinishDate= null;     //完成时间-执行事件表
        Date executorRemindDate=null;       //提醒时间-执行事件表
        try {
            if(inDto.getExecutorFinishDate()!=null) {
                executorFinishDate = df2.parse(inDto.getExecutorFinishDate());//完成时间-执行事件表
            }
            if(inDto.getExecutorRemindDate()!=null) {
                executorRemindDate = df2.parse(inDto.getExecutorRemindDate());    //提醒时间-执行事件表
            }
        } catch (ParseException e) {
            e.printStackTrace();
            return -1;
        }

        String scheduledState=inDto.getScheduleState();//事件状态(-1 未完成 1完成)
        String executorRemindRepeat=inDto.getExecutorRemindRepeat();     //重复提醒-执行事件表
        String executorRemindRepeatType=inDto.getExecutorRemindRepeatType();     //重复提醒类型-执行事件表（1 每日 2 每月 3每年）


        if(userMobile!=null){
            //添加群组创建人
            userId=inDto.getScheduleIssuer();//获取用户id
            int roleId=1;//1群主 2成员 3发布人 4执行人
            String groupName=inDto.getScheduleName();
            if("0".equals(inDto.getFlagCreateGroup())){
                IGroupService.createGroup(groupId,groupName,userId, roleId);
            }
            //分割电话号码
            String[] mobile = userMobile.split(",");
            for (int i = 0; i < mobile.length; i++) {
                //获取用户id
                UserInfoOutDto userInfo= userDao.findUser(mobile[i]);
                int userIdZX=userInfo.getUserId();// 执行人id/获取用户id


                groupId=inDto.getGroupId();
                roleId=2;
                groupName=inDto.getScheduleName();
                if(userId!=userIdZX){

                    //添加执行事件表
                    scheduleDao.createExecutorScheduleId(userIdZX,scheduledId,executorFinishDate,scheduledState,executorRemindDate,executorRemindRepeat,executorRemindRepeatType);

                    //添加群组
                    if("0".equals(inDto.getFlagCreateGroup())) {
                        IGroupService.createGroup(groupId, groupName, userIdZX, roleId);
                    }
                }

            }
        }else{
            //执行人为空时发布人变为执行人
            userId=inDto.getScheduleIssuer();
            scheduleDao.createExecutorScheduleId(userId,scheduledId,executorFinishDate,scheduledState,executorRemindDate,executorRemindRepeat,executorRemindRepeatType);
        }

        return 0;
    }


//    /**
//     * 日程关联创建（执行事件表）
//     * @param
//     */
//    public  void   createExecutorSchedule(@RequestBody ScheduleInDto inDto){
//
//    }

    /**
     * 查询个人单条日程信息
     *
     * @param scheduledId
     * @return
     */
    @Override
    public ScheduleOutDto findScheduleByOne(int scheduledId) {

        return scheduleDao.findScheduleByOne(scheduledId);
    }

    /**
     * 编辑个人单条日程信息
     *
     * @param inDto
     * @return
     */
    @Override
    public int updateSchedule(ScheduleInDto inDto) {

        DateFormat df2= new SimpleDateFormat("yyyy-MM-dd HH:mm");
        int scheduledId=inDto.getScheduleId();
        String scheduleName=inDto.getScheduleName();
        String scheduleDetail=inDto.getScheduleDetail();
        int scheduleIssuer=inDto.getScheduleIssuer();
        Date scheduleCreateDate= null;
        Date scheduleStartDate=null;
        Date scheduleFinishDate=null;
        Date scheduleEndDate=null;
        Date scheduleRemindDate=null;
        Date scheduleEditDate=null;
        /* 时间类型转化 */
        try {
            if (inDto.getScheduleCreateDate() != null) {
                scheduleCreateDate = df2.parse(inDto.getScheduleCreateDate());
            }
            if (inDto.getScheduleStartDate() != null) {
                scheduleStartDate = df2.parse(inDto.getScheduleStartDate());
            }
            if (inDto.getScheduleFinishDate() != null) {
                scheduleFinishDate = df2.parse(inDto.getScheduleFinishDate());
            }
            if (inDto.getScheduleEndDate() != null) {
                scheduleEndDate = df2.parse(inDto.getScheduleEndDate());
            }
            if (inDto.getScheduleRemindDate() != null) {
                scheduleRemindDate = df2.parse(inDto.getScheduleEndDate());
            }
            if (inDto.getScheduleEditDate() != null) {
                scheduleEditDate = df2.parse(inDto.getScheduleEndDate());
            }
        } catch (ParseException e) {
            e.printStackTrace();
            return -1;
        }

        String scheduleState=inDto.getScheduleState();
        String GroupId=inDto.getGroupId();
        String scheduleMap=inDto.getScheduleMap();
        String scheduleRemindRepeat=inDto.getScheduleRemindRepeat();
        String scheduleRemindRepeatTyp=inDto.getScheduleRemindRepeatType();

        scheduleDao.updateSchedule(scheduledId,scheduleName,scheduleDetail,
                scheduleIssuer,scheduleCreateDate,scheduleStartDate,
                scheduleEditDate,scheduleFinishDate,scheduleEndDate,
                scheduleState,GroupId,scheduleMap,
                scheduleRemindDate,scheduleRemindRepeat,scheduleRemindRepeatTyp);
        return 0;
    }

    /**
     * 查询一个群组下的所有日程
     *
     * @param groupId
     * @return
     */
    @Override
    public List<ScheduleOutDto> findScheduleByGroup(String groupId) {
        String result = "";
        //查询群组下的日程
        List<ScheduleOutDto> schList= scheduleDao.findScheduleByGroup(groupId);
        DateFormat dFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm"); //HH表示24小时制；


        for (ScheduleOutDto sod : schList ) {

            sod = dateChangeFormat(sod);

            List<ScheduleOutDto> sodAndUser =  scheduleDao.findScheduleAndUserName(groupId);
            //拼接执行人姓名
            for (ScheduleOutDto sodUser : sodAndUser) {
                String userName = sodUser.getExecutorName();
                if ("".equals(result) || result==null){
                    result = userName;
                }else {
                    result = result+","+userName;
                }

            }
            sod.setExecutorName(result);
        }

        return schList;
    }

    /**
     * 查询一个群组下的所有日程（含有执行人姓名）
     *
     * @param groupId
     * @return
     */
    @Override
    public List<ScheduleOutDto> findScheduleAndUserName(String groupId) {
        return scheduleDao.findScheduleAndUserName(groupId);
    }

    /**
     * 根据事件ID和执行人ID查询事件表和执行事件表。
     *
     * @param userId
     * @return
     */
    @Override
    public ScheduleOutDto findScheduleAndExeBySchIdAndUserId(int scheduleId,int userId) {
        ScheduleOutDto dataDto = scheduleDao.findScheduleAndExeBySchIdAndUserId(scheduleId,userId);

        dataDto = dateChangeFormat(dataDto);

        return dataDto;
    }

    /**
     * 群组事件创建
     *
     * @param inDto
     */
    @Override
    public int createSchByGroupId(ScheduleInDto inDto) {
        inDto.setScheduleState("-1"); //事件状态SCHEDULE_STATE(-1 未完成 1完成)
        DateFormat df2= new SimpleDateFormat("yyyy-MM-dd HH:mm");

        String  groupId = null;
        Date scheduleCreateDate= null;// 创建时间
        Date scheduleStartDate=null;// 开始时间
        Date scheduleFinishDate=null;// 完成时间
        Date scheduleEndDate=null;// 截止时间
        Date scheduleRemindDate=null;//提醒时间
        Date scheduleEditDate=null;
        Date executorFinishDate= null;     //完成时间-执行事件表
        Date executorRemindDate=null;       //提醒时间-执行事件表
        try {
            if (inDto.getScheduleCreateDate() != null) {
                scheduleCreateDate = df2.parse(inDto.getScheduleCreateDate());
            }
            if (inDto.getScheduleStartDate() != null) {
                scheduleStartDate = df2.parse(inDto.getScheduleStartDate());
            }
            if (inDto.getScheduleFinishDate() != null) {
                scheduleFinishDate = df2.parse(inDto.getScheduleFinishDate());
            }
            if (inDto.getScheduleEndDate() != null) {
                scheduleEndDate = df2.parse(inDto.getScheduleEndDate());
            }
            if (inDto.getScheduleRemindDate() != null) {
                scheduleRemindDate = df2.parse(inDto.getScheduleEndDate());
            }
            if (inDto.getScheduleEditDate() != null) {
                scheduleEditDate = df2.parse(inDto.getScheduleEndDate());
            }
            if(inDto.getExecutorFinishDate()==null) {
                executorFinishDate = df2.parse(inDto.getExecutorFinishDate());//完成时间-执行事件表
            }
            if(inDto.getExecutorRemindDate()==null) {
                executorRemindDate = df2.parse(inDto.getScheduleEndDate());    //提醒时间-执行事件表
            }

            String scheduleName=inDto.getScheduleName();//事件名称
            String scheduleDetail=inDto.getScheduleDetail();//事件详情
            int scheduleIssuer=inDto.getScheduleIssuer();//发布人id
            String scheduleState=inDto.getScheduleState();//事件状态(-1 未完成 1完成)

            groupId=inDto.getGroupId();//组群id
            String scheduleMap=inDto.getScheduleMap();//位置
            String scheduleRemindRepeat=inDto.getScheduleRemindRepeat();//重复提醒
            String  scheduleRemindRepeatType=inDto.getScheduleRemindRepeatType();//重复提醒类型SCHEDULE_REMIND_REPEAT_TYPE（1 每日 2 每月 3每年）
            scheduleDao.createSchByGroupId(scheduleName,scheduleDetail,scheduleIssuer,
                    scheduleCreateDate,scheduleStartDate,scheduleEditDate, scheduleFinishDate,
                    scheduleEndDate,scheduleState,groupId,
                    scheduleMap,scheduleRemindDate,scheduleRemindRepeat,
                    scheduleRemindRepeatType);
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }

        int  userId = 0;
        int scheduledId = inDto.getScheduleId();         //执行事件IDSCHEDULE_ID
        String userMobile = inDto.getUserId();         //执行人电话（执行人id）String  ,拼写字符串

        String scheduledState=inDto.getScheduleState();//事件状态(-1 未完成 1完成)
        String executorRemindRepeat=inDto.getExecutorRemindRepeat();     //重复提醒-执行事件表
        String executorRemindRepeatType=inDto.getExecutorRemindRepeatType();     //重复提醒类型-执行事件表（1 每日 2 每月 3每年）


        if(userMobile!=null){

            userId=inDto.getScheduleIssuer();//获取用户id

            //分割电话号码
            String[] mobile = userMobile.split(",");
            for (int i = 0; i < mobile.length; i++) {
                //获取用户id
                UserInfoOutDto userInfo= userDao.findUser(mobile[i]);
                int userIdZX=userInfo.getUserId();// 执行人id/获取用户id

                if(userId!=userIdZX){

                    //添加执行事件表
                    scheduleDao.createExecutorScheduleId(userIdZX,scheduledId,executorFinishDate,scheduledState,executorRemindDate,executorRemindRepeat,executorRemindRepeatType);

                }

            }
        }else{
            //执行人为空时发布人变为执行人
            userId=inDto.getScheduleIssuer();
            scheduleDao.createExecutorScheduleId(userId,scheduledId,executorFinishDate,scheduledState,executorRemindDate,executorRemindRepeat,executorRemindRepeatType);
        }

        return 0;
    }

    /**
     * 个人日历日程查询
     *
     * @param date
     * @param userId
     * @return
     */
    @Override
    public PersonScheduleDto createSchByCalendar(String date, int userId) {
        String CalendarDate=date;   //日期月份
        String dayStarDate=date+"-01";
        String dayEndDate=date+"-31";
        PersonScheduleDto PersonScheduleDto=new PersonScheduleDto();
        List<ScheduleOutDto> Scheduledata=scheduleDao.createSchByCalendar(dayStarDate,dayEndDate,userId);

        for(ScheduleOutDto sod:Scheduledata ){
            String [] breakDate=null;
            if (sod.getScheduleStartDate()!=null){
                breakDate=sod.getScheduleStartDate().split(" ");
                String  schDate=breakDate[0];
            }

        }
        return PersonScheduleDto;
    }

    /**
     * 编辑个人单条日程信息
     *
     * @param inDto
     * @return
     */
    @Override
    public int updateScheduleByScheduleIdAndUserId(ScheduleInDto inDto) {
        String  userId = inDto.getUserId();
        int scheduleId = inDto.getScheduleId();
        String executorFinishDate = inDto.getExecutorFinishDate();
        String executorState = inDto.getScheduleState();
        String executorRemindDate = inDto.getExecutorRemindDate();
        String executorRemindRepeat = inDto.getExecutorRemindRepeat();
        String executorRemindRepeatType = inDto.getExecutorRemindRepeatType();

        scheduleDao.updateScheduleByScheduleIdAndUserId(userId,scheduleId,executorFinishDate,executorState,executorRemindDate,executorRemindRepeat,executorRemindRepeatType);

        return 0;
    }

    @Override
    public int taskAnnouncement(ScheduleInDto inDto) {

        DateFormat df2= new SimpleDateFormat("yyyy-MM-dd HH:mm");

        String scheduleName=inDto.getScheduleName();//事件名称
        String scheduleDetail=inDto.getScheduleDetail();//事件详情
        int scheduleIssuer = inDto.getScheduleIssuer();//发布人id
        String scheduleState = inDto.getScheduleState();//事件状态(-1 未接受 1未完成 0完成)
        String  groupId = inDto.getGroupId();//组群id
        String scheduleMap = inDto.getScheduleMap();//位置

        Date scheduleCreateDate= null;// 创建时间
        Date scheduleStartDate=null;// 开始时间
        Date scheduleFinishDate=null;// 完成时间
        Date scheduleEndDate=null;// 截止时间
        Date scheduleRemindDate=null;//提醒时间
        try {
            if (inDto.getScheduleCreateDate() != null) {
                scheduleCreateDate = df2.parse(inDto.getScheduleCreateDate());
            }
            if (inDto.getScheduleStartDate() != null) {
                scheduleStartDate = df2.parse(inDto.getScheduleStartDate());
            }
            if (inDto.getScheduleFinishDate() != null) {
                scheduleFinishDate = df2.parse(inDto.getScheduleFinishDate());
            }
            if (inDto.getScheduleEndDate() != null) {
                scheduleEndDate = df2.parse(inDto.getScheduleEndDate());
            }
            if (inDto.getScheduleRemindDate() != null) {
                scheduleRemindDate = df2.parse(inDto.getScheduleEndDate());
            }
        } catch (ParseException e) {
            e.printStackTrace();
            return -1;
        }

        String scheduleRemindRepeat = inDto.getScheduleRemindRepeat();//重复提醒
        String scheduleRemindRepeatType = inDto.getScheduleRemindRepeatType();//重复提醒类型SCHEDULE_REMIND_REPEAT_TYPE（1 每日 2 每月 3每年）
        scheduleDao.createSchedule(scheduleName,scheduleDetail,scheduleIssuer,
                scheduleCreateDate,scheduleStartDate,scheduleFinishDate,
                scheduleEndDate,scheduleState,groupId,
                scheduleMap,scheduleRemindDate,scheduleRemindRepeat,
                scheduleRemindRepeatType);

        int  userId = 0;
        int scheduledId = inDto.getScheduleId();         //执行事件IDSCHEDULE_ID
        String userMobile = inDto.getUserId();         //执行人电话（执行人id）String  ,拼写字符串
        Date executorFinishDate= null;     //完成时间-执行事件表
        Date executorRemindDate=null;       //提醒时间-执行事件表
        try {
            if(inDto.getExecutorFinishDate()!=null) {
                executorFinishDate = df2.parse(inDto.getExecutorFinishDate());//完成时间-执行事件表
            }
            if(inDto.getExecutorRemindDate()!=null) {
                executorRemindDate = df2.parse(inDto.getExecutorRemindDate());    //提醒时间-执行事件表
            }
        } catch (ParseException e) {
            e.printStackTrace();
            return -1;
        }

        String scheduledState=inDto.getScheduleState();//事件状态(-1 未接受 1未完成 0完成)
        String executorRemindRepeat=inDto.getExecutorRemindRepeat();     //重复提醒-执行事件表
        String executorRemindRepeatType=inDto.getExecutorRemindRepeatType();     //重复提醒类型-执行事件表（1 每日 2 每月 3每年）


        if(userMobile!=null){
            //添加群组创建人
            userId=inDto.getScheduleIssuer();//获取用户id
            int roleId=1;//1群主 2成员 3发布人 4执行人
            String groupName=inDto.getScheduleName();
            if("0".equals(inDto.getFlagCreateGroup())){
                IGroupService.createGroup(groupId,groupName,userId, roleId);
            }
            //分割电话号码
            String[] mobile = userMobile.split(",");
            for (int i = 0; i < mobile.length; i++) {
                //获取用户id
                UserInfoOutDto userInfo= userDao.findUser(mobile[i]);
                int userIdZX=userInfo.getUserId();// 执行人id/获取用户id


                groupId=inDto.getGroupId();
                roleId=2;
                groupName=inDto.getScheduleName();
                if(userId!=userIdZX){

                    //添加执行事件表
                    scheduleDao.createExecutorScheduleId(userIdZX,scheduledId,executorFinishDate,scheduledState,executorRemindDate,executorRemindRepeat,executorRemindRepeatType);

                    //添加群组
                    if("0".equals(inDto.getFlagCreateGroup())) {
                        IGroupService.createGroup(groupId, groupName, userIdZX, roleId);
                    }
                }

            }
        }else{
            //执行人为空时发布人变为执行人
            userId=inDto.getScheduleIssuer();
            scheduleDao.createExecutorScheduleId(userId,scheduledId,executorFinishDate,scheduledState,executorRemindDate,executorRemindRepeat,executorRemindRepeatType);
        }

        return 0;
    }

    /**
     * 日程日期格式转化公共方法
     * @param data
     * @return
     */
    private ScheduleOutDto dateChangeFormat(ScheduleOutDto data) {
        ScheduleOutDto outDto = data;

        /* 日程表 */
        //创建时间
        String scheduleCreateDateString = outDto.getScheduleCreateDate();
        if(scheduleCreateDateString != null && !"".equals(scheduleCreateDateString)){
            int endpointCreateDate =scheduleCreateDateString.indexOf(".");
            if(endpointCreateDate > 0){
                scheduleCreateDateString  = scheduleCreateDateString.substring(0,endpointCreateDate - 3);
            }
        }
        outDto.setScheduleCreateDate(scheduleCreateDateString);
        //完成时间
        String scheduleFinishDateString = outDto.getScheduleFinishDate();
        if(scheduleFinishDateString!=null &&!"".equals(scheduleFinishDateString)) {
            int endpointFinishDate =scheduleFinishDateString.indexOf(".");
            if (endpointFinishDate > 0) {
                scheduleFinishDateString = scheduleFinishDateString.substring(0, endpointFinishDate - 3);
            }
        }
        outDto.setScheduleFinishDate(scheduleFinishDateString);
        //提醒时间
        String scheduleRemindDateString = outDto.getScheduleRemindDate();
        if(scheduleRemindDateString!=null &&!"".equals(scheduleRemindDateString)) {
            int endpointRemindDate =scheduleRemindDateString.indexOf(".");
            if (endpointRemindDate > 0) {
                scheduleRemindDateString = scheduleRemindDateString.substring(0, endpointRemindDate - 3);
            }
        }
        outDto.setScheduleRemindDate(scheduleRemindDateString);
        //截止时间
        String scheduleEndDateString = outDto.getScheduleEndDate();
        if(scheduleEndDateString!=null &&!"".equals(scheduleEndDateString)){
            int endpointEndDate =scheduleEndDateString.indexOf(".");
            if(endpointEndDate>0){
                scheduleEndDateString  = scheduleEndDateString.substring(0,endpointEndDate-3);
            }
        }
        outDto.setScheduleEndDate(scheduleEndDateString);
        //开始时间
        String scheduleStartDateString = outDto.getScheduleStartDate();
        if(scheduleStartDateString!=null &&!"".equals(scheduleStartDateString)) {
            int endpointStartDate =scheduleStartDateString.indexOf(".");
            if (endpointStartDate > 0) {
                scheduleStartDateString = scheduleStartDateString.substring(0, endpointStartDate - 3);
            }
        }
        outDto.setScheduleStartDate(scheduleStartDateString);
        //更新时间
        String scheduleEditDateString = outDto.getScheduleEditDate();
        if(scheduleEditDateString!=null &&!"".equals(scheduleEditDateString)) {
            int endpointEditDate =scheduleEditDateString.indexOf(".");
            if (endpointEditDate > 0) {
                scheduleEditDateString = scheduleEditDateString.substring(0, endpointEditDate - 3);
            }
        }
        outDto.setScheduleEditDate(scheduleEditDateString);

        /* 执行表 */
        //个人完成时间
        String executorFinishDateString = outDto.getScheduleFinishDate();
        if(executorFinishDateString!=null &&!"".equals(executorFinishDateString)) {
            int endpointFinishDate =executorFinishDateString.indexOf(".");
            if (endpointFinishDate > 0) {
                executorFinishDateString = executorFinishDateString.substring(0, endpointFinishDate - 3);
            }
        }
        outDto.setExecutorFinishDate(executorFinishDateString);
        //个人提醒时间
        String executorRemindDateString = outDto.getExecutorRemindDate();
        if(executorRemindDateString!=null &&!"".equals(executorRemindDateString)) {
            int endpointRemindDate =executorRemindDateString.indexOf(".");
            if (endpointRemindDate > 0) {
                executorRemindDateString = executorRemindDateString.substring(0, endpointRemindDate - 3);
            }
        }
        outDto.setExecutorRemindDate(executorRemindDateString);
        //个人执行更新时间
        String executorEditDateString = outDto.getExecutorEditDate();
        if(executorEditDateString!=null &&!"".equals(executorEditDateString)) {
            int endpointEditDate =executorEditDateString.indexOf(".");
            if (endpointEditDate > 0) {
                executorEditDateString = executorEditDateString.substring(0, endpointEditDate - 3);
            }
        }
        outDto.setExecutorEditDate(executorEditDateString);

        return outDto;
    }
}
