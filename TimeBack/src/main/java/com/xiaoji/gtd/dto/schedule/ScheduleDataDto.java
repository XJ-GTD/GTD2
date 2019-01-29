package com.xiaoji.gtd.dto.schedule;

import com.xiaoji.gtd.dto.player.PlayerDataDto;

import java.util.List;

/**
 *  日程数据类
 *
 *  create by wzy on 2019/01/17
 */
public class ScheduleDataDto {

    private String scheduleId;          //scheduleId;
    private String scheduleName;      //scheduleName;
    private String startTime;      //startTime;
    private String endTime;      //endTime;
    private String label;      //label;
    private List<PlayerDataDto> players;     //players 包含accountMobile和userId
    private String status;      //status;

    private String executeId;       //executeId
    private String playerId;     //playerId;
    private Integer scheduleAuth;     //scheduleAuth

    private String id;      //子表ID
    private String comment;     //备注
    private String repeatType;      //重复类型
    private String remindType;      //提醒类型
    private String remindTime;      //提醒时间
    private String finishStatus;    //完成状态
    private String finishTime;      //  完成时间

    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(String scheduleId) {
        this.scheduleId = scheduleId;
    }

    public List<PlayerDataDto> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerDataDto> players) {
        this.players = players;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getRepeatType() {
        return repeatType;
    }

    public void setRepeatType(String repeatType) {
        this.repeatType = repeatType;
    }

    public String getRemindType() {
        return remindType;
    }

    public void setRemindType(String remindType) {
        this.remindType = remindType;
    }

    public String getRemindTime() {
        return remindTime;
    }

    public void setRemindTime(String remindTime) {
        this.remindTime = remindTime;
    }

    public String getFinishStatus() {
        return finishStatus;
    }

    public void setFinishStatus(String finishStatus) {
        this.finishStatus = finishStatus;
    }

    public String getFinishTime() {
        return finishTime;
    }

    public void setFinishTime(String finishTime) {
        this.finishTime = finishTime;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getExecuteId() {
        return executeId;
    }

    public void setExecuteId(String executeId) {
        this.executeId = executeId;
    }

    public Integer getScheduleAuth() {
        return scheduleAuth;
    }

    public void setScheduleAuth(Integer scheduleAuth) {
        this.scheduleAuth = scheduleAuth;
    }
}
