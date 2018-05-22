package com.manager.master.dto;

import java.util.List;
import java.util.Map;

/**
 * create by wjf
 * 2018/5/17
 */
public class PersonScheduleDto {

    private Map<String, List<ScheduleOutDto>> data ;

    private List<ScheduleOutDto> ScheduleDataList;

    private String calendarDate;

    public Map<String, List<ScheduleOutDto>> getData() {
        return data;
    }

    public void setData(Map<String, List<ScheduleOutDto>> data) {
        this.data = data;
    }

    public List<ScheduleOutDto> getScheduleDataList() {
        return ScheduleDataList;
    }

    public void setScheduleDataList(List<ScheduleOutDto> scheduleDataList) {
        ScheduleDataList = scheduleDataList;
    }

    public String getCalendarDate() {
        return calendarDate;
    }

    public void setCalendarDate(String calendarDate) {
        this.calendarDate = calendarDate;
    }
}
