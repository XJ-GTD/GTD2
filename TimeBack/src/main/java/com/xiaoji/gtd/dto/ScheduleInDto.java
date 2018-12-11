package com.xiaoji.gtd.dto;

import java.util.List;
import java.util.Map;

/**
 * 日程类入参
 *
 * Create by wzy on 2018/12/11
 */
public class ScheduleInDto {

    private String userId;
    private String skillType;      //skillType;
    //业务
    private String scheduleName;      //scheduleName;
    private String startTime;      //startTime;
    private String endTime;      //endTime;
    private String label;      //label;
    private String planName;      //planName;
    private List<Map<String, String>> playerName;     //playerName 包含accountMobile和userId
    private String status;      //status;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSkillType() {
        return skillType;
    }

    public void setSkillType(String skillType) {
        this.skillType = skillType;
    }

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

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public List<Map<String, String>> getPlayerName() {
        return playerName;
    }

    public void setPlayerName(List<Map<String, String>> playerName) {
        this.playerName = playerName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
