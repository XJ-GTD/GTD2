package com.xiaoji.master.dto;

/**
 *  每月日程详情
 */
public class ScheduleDetailsInDto {
    private Integer userId; // 用户id
    private String year;    // 查询年份
    private String month;   // 查询月份
    private int daySum;     // 当月天数

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public int getDaySum() {
        return daySum;
    }

    public void setDaySum(int daySum) {
        this.daySum = daySum;
    }

    @Override
    public String toString() {
        return "ScheduleDetailsInDto{" +
                "userId=" + userId +
                ", year='" + year + '\'' +
                ", mouth='" + month + '\'' +
                ", daySum=" + daySum +
                '}';
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }
}
