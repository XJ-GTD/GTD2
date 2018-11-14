package com.xiaoji.master.dto;

import java.util.List;

/**
 *  每月日程详情
 */
public class ScheduleDetailsOutDto {
    private String date;    // 时间
    private String flag;    // 日程存在标记  1-存在 0-不存在

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    @Override
    public String toString() {
        return "ScheduleDetailsOutDto{" +
                "date='" + date + '\'' +
                ", flag='" + flag + '\'' +
                '}';
    }
}
