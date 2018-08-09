package com.manager.master.dto;


import java.util.Date;

/**
 * 日程
 * create  zy
 */
public class ScheduleInDto {

    private String scheduleName;         //事件名
    private String scheduleDetail;       //事件详情
    private int scheduleIssuer;       //发布人
    private String scheduleCreateDate;     //创建时间SCHEDULE_CREATE_DATE
    private String scheduleStartDate;     //开始时间SCHEDULE_START_DATE
    private String scheduleFinishDate;     //完成时间SCHEDULE_FINISH_DATE
    private String scheduleEndDate;     //截止时间SCHEDULE_END_DATE
    private String scheduleState;     //事件状态SCHEDULE_STATE(-1 未完成 1完成)
    private String GroupId;          //组群idGROUP_ID
    private String scheduleMap;     //位置SCHEDULE_MAP
    private String scheduleRemindDate;     //提醒时间SCHEDULE_REMIND_DATE
    private String scheduleRemindRepeat;     //重复提醒SCHEDULE_REMIND_REPEAT
    private String scheduleRemindRepeatType;     //重复提醒类型SCHEDULE_REMIND_REPEAT_TYPE（1 每日 2 每月 3每年）
    private String flagCreateGroup;     //是否创建群组（1否 0是）
    private String flagFocus;     //是否关注（1否 0是）



    private Date scheduleEditDate;//修改时间SCHEDULE_EDIT_DATE
    //执行事件表(日程关联表)
    private int scheduleId;          //执行事件IDSCHEDULE_ID
    private String scheduleExecutor;         //执行人电话（执行人id）  String  ,拼写字符串
    private String ExecutorFinishDate;     //完成时间-执行事件表
    private String ExecutorRemindDate;    //提醒时间-执行事件表
    private String ExecutorRemindRepeat;     //重复提醒-执行事件表
    private String ExecutorRemindRepeatType;     //重复提醒类型-执行事件表（1 每日 2 每月 3每年）

    private String schedulePhoneNum;//发布人电话号码
    private String scheduleFinishDateString;//完成时间(String)

    private String userId;
    private String target;
    private String code;


    public Date getScheduleEditDate() {
        return scheduleEditDate;
    }

    public void setScheduleEditDate(Date scheduleEditDate) {
        this.scheduleEditDate = scheduleEditDate;
    }

    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    public String getScheduleDetail() {
        return scheduleDetail;
    }

    public void setScheduleDetail(String scheduleDetail) {
        this.scheduleDetail = scheduleDetail;
    }

    public int getScheduleIssuer() {
        return scheduleIssuer;
    }

    public void setScheduleIssuer(int scheduleIssuer) {
        this.scheduleIssuer = scheduleIssuer;
    }


    public String getScheduleState() {
        return scheduleState;
    }

    public void setScheduleState(String scheduleState) {
        this.scheduleState = scheduleState;
    }

    public String getGroupId() {
        return GroupId;
    }

    public void setGroupId(String groupId) {
        GroupId = groupId;
    }

    public String getScheduleMap() {
        return scheduleMap;
    }

    public void setScheduleMap(String scheduleMap) {
        this.scheduleMap = scheduleMap;
    }


    public String getScheduleRemindRepeat() {
        return scheduleRemindRepeat;
    }

    public void setScheduleRemindRepeat(String scheduleRemindRepeat) {
        this.scheduleRemindRepeat = scheduleRemindRepeat;
    }

    public String getScheduleRemindRepeatType() {
        return scheduleRemindRepeatType;
    }

    public void setScheduleRemindRepeatType(String scheduleRemindRepeatType) {
        this.scheduleRemindRepeatType = scheduleRemindRepeatType;
    }

    public String getFlagCreateGroup() {
        return flagCreateGroup;
    }

    public void setFlagCreateGroup(String flagCreateGroup) {
        this.flagCreateGroup = flagCreateGroup;
    }

    public String getFlagFocus() {
        return flagFocus;
    }

    public void setFlagFocus(String flagFocus) {
        this.flagFocus = flagFocus;
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
    }

    public String getExecutorFinishDate() {
        return ExecutorFinishDate;
    }

    public void setExecutorFinishDate(String executorFinishDate) {
        ExecutorFinishDate = executorFinishDate;
    }

    public String getExecutorRemindDate() {
        return ExecutorRemindDate;
    }

    public void setExecutorRemindDate(String executorRemindDate) {
        ExecutorRemindDate = executorRemindDate;
    }

    public String getExecutorRemindRepeat() {
        return ExecutorRemindRepeat;
    }

    public void setExecutorRemindRepeat(String executorRemindRepeat) {
        ExecutorRemindRepeat = executorRemindRepeat;
    }

    public String getExecutorRemindRepeatType() {
        return ExecutorRemindRepeatType;
    }

    public void setExecutorRemindRepeatType(String executorRemindRepeatType) {
        ExecutorRemindRepeatType = executorRemindRepeatType;
    }

    public String getSchedulePhoneNum() {
        return schedulePhoneNum;
    }

    public void setSchedulePhoneNum(String schedulePhoneNum) {
        this.schedulePhoneNum = schedulePhoneNum;
    }

    public String getScheduleFinishDateString() {
        return scheduleFinishDateString;
    }

    public void setScheduleFinishDateString(String scheduleFinishDateString) {
        this.scheduleFinishDateString = scheduleFinishDateString;
    }

    public String getScheduleCreateDate() {
        return scheduleCreateDate;
    }

    public void setScheduleCreateDate(String scheduleCreateDate) {
        this.scheduleCreateDate = scheduleCreateDate;
    }

    public String getScheduleStartDate() {
        return scheduleStartDate;
    }

    public void setScheduleStartDate(String scheduleStartDate) {
        this.scheduleStartDate = scheduleStartDate;
    }

    public String getScheduleFinishDate() {
        return scheduleFinishDate;
    }

    public void setScheduleFinishDate(String scheduleFinishDate) {
        this.scheduleFinishDate = scheduleFinishDate;
    }

    public String getScheduleEndDate() {
        return scheduleEndDate;
    }

    public void setScheduleEndDate(String scheduleEndDate) {
        this.scheduleEndDate = scheduleEndDate;
    }

    public String getScheduleRemindDate() {
        return scheduleRemindDate;
    }

    public void setScheduleRemindDate(String scheduleRemindDate) {
        this.scheduleRemindDate = scheduleRemindDate;
    }

    @Override
    public String toString() {
        return "{ \"scheduleName\":\"" + scheduleName + '\"' +
                ", \"scheduleDetail\":\"" + scheduleDetail + '\"' +
                ", \"scheduleIssuer\":\"" + scheduleIssuer + '\"' +
                ", \"scheduleStartDate\":\"" + scheduleStartDate + '\"' +
                ", \"scheduleEndDate\":\"" + scheduleEndDate + '\"' +
                ", \"scheduleExecutor\":\"" + scheduleExecutor + '\"' +
                ", \"code\":\"" + code + '\"' +
                '}';
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getScheduleExecutor() {
        return scheduleExecutor;
    }

    public void setScheduleExecutor(String scheduleExecutor) {
        this.scheduleExecutor = scheduleExecutor;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
