package com.xiaoji.gtd.dto.schedule;

import java.util.List;

/**
 * 日程类入参
 *
 * Create by wzy on 2018/12/11
 */
public class ScheduleInDto {

    private String userId;
    private String skillType;      //skillType;

    private List<ScheduleDataDto> scheduleList;

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

    public List<ScheduleDataDto> getScheduleList() {
        return scheduleList;
    }

    public void setScheduleList(List<ScheduleDataDto> scheduleList) {
        this.scheduleList = scheduleList;
    }
}
