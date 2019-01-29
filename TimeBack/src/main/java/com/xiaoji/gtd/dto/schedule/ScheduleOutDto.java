package com.xiaoji.gtd.dto.schedule;

import com.xiaoji.gtd.dto.BaseOut;

import java.util.List;

/**
 * 日程处理输出类
 *
 * create by wzy on 2019/01/29
 */
public class ScheduleOutDto extends BaseOut {

    private List<ScheduleOutData> scheduleList;

    public List<ScheduleOutData> getScheduleList() {
        return scheduleList;
    }

    public void setScheduleList(List<ScheduleOutData> scheduleList) {
        this.scheduleList = scheduleList;
    }
}
