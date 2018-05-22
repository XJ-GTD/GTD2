package com.manager.master.dto;

/**
 * 日程
 * creaty  zy
 */
public class ScheduleOutDto {
    private int scheduleId;         //事件id
    private String scheduleName;         //事件名
    private String scheduleDetail;       //事件详情
    private int scheduleIssuer;       //发布人

    private String scheduleIssuerName;       //发布人姓名

    private int scheduleExecutor;       //执行人EXECUTOR
    private String scheduleCreateDate;     //创建时间SCHEDULE_CREATE_DATE
    private String  scheduleStartDate;     //开始时间SCHEDULE_START_DATE
    private String  scheduleFinishDate;     //完成时间SCHEDULE_FINISH_DATE
    private String scheduleEndDate;     //截止时间SCHEDULE_END_DATE
    private String scheduleState;     //事件状态SCHEDULE_STATE(-1 未完成 1完成)
    private String groupId;          //组群idGROUP_ID
    private String scheduleMap;     //位置SCHEDULE_MAP
    private String scheduleRemindDate;     //提醒时间SCHEDULE_REMIND_DATE
    private String scheduleRemindRepeat;     //重复提醒SCHEDULE_REMIND_REPEAT
    private String scheduleRemindRepeatType;     //重复提醒类型SCHEDULE_REMIND_REPEAT_TYPE（1 每日 2 每月 3每年）
    private String scheduleEditDate;//修改时间SCHEDULE_EDIT_DATE

    //执行事件表(日程关联表)
    private String executorFinishDate;     //完成时间-执行事件表
    private String executorRemindDate;    //提醒时间-执行事件表
    private String executorRemindRepeat;     //重复提醒-执行事件表
    private String executorRemindRepeatType;     //重复提醒类型-执行事件表（1 每日 2 每月 3每年）
    private String userId;//执行人ID  USER_ID
    private String executorEditDate;    //修改时间SCHEDULE_EDIT_DATE

    //事件ID
    private int executorState;//事件状态 EXECUTOR_STATE
    //用户表
    private String userName;//执行人姓名（用户表里的用户名）

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
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

    public String getScheduleIssuerName() {
        return scheduleIssuerName;
    }

    public void setScheduleIssuerName(String scheduleIssuerName) {
        this.scheduleIssuerName = scheduleIssuerName;
    }

    public int getScheduleExecutor() {
        return scheduleExecutor;
    }

    public void setScheduleExecutor(int scheduleExecutor) {
        this.scheduleExecutor = scheduleExecutor;
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

    public String getScheduleState() {
        return scheduleState;
    }

    public void setScheduleState(String scheduleState) {
        this.scheduleState = scheduleState;
    }

    public String getScheduleMap() {
        return scheduleMap;
    }

    public void setScheduleMap(String scheduleMap) {
        this.scheduleMap = scheduleMap;
    }

    public String getScheduleRemindDate() {
        return scheduleRemindDate;
    }

    public void setScheduleRemindDate(String scheduleRemindDate) {
        this.scheduleRemindDate = scheduleRemindDate;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getScheduleEditDate() {
        return scheduleEditDate;
    }

    public void setScheduleEditDate(String scheduleEditDate) {
        this.scheduleEditDate = scheduleEditDate;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getExecutorState() {
        return executorState;
    }

    public void setExecutorState(int executorState) {
        this.executorState = executorState;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getExecutorFinishDate() {
        return executorFinishDate;
    }

    public void setExecutorFinishDate(String executorFinishDate) {
        this.executorFinishDate = executorFinishDate;
    }

    public String getExecutorRemindDate() {
        return executorRemindDate;
    }

    public void setExecutorRemindDate(String executorRemindDate) {
        this.executorRemindDate = executorRemindDate;
    }

    public String getExecutorRemindRepeat() {
        return executorRemindRepeat;
    }

    public void setExecutorRemindRepeat(String executorRemindRepeat) {
        this.executorRemindRepeat = executorRemindRepeat;
    }

    public String getExecutorRemindRepeatType() {
        return executorRemindRepeatType;
    }

    public void setExecutorRemindRepeatType(String executorRemindRepeatType) {
        this.executorRemindRepeatType = executorRemindRepeatType;
    }

    public String getExecutorEditDate() {
        return executorEditDate;
    }

    public void setExecutorEditDate(String executorEditDate) {
        this.executorEditDate = executorEditDate;
    }
}
