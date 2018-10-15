package com.manager.master.dto;

/**
 *  每月日程详情
 */
public class ScheduleDetailsInDto {
    private Integer userId; // 用户id
    private String year;    // 查询年份
    private String mouth;   // 查询月份
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

    public String getMouth() {
        return mouth;
    }

    public void setMouth(String mouth) {
        this.mouth = mouth;
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
                ", mouth='" + mouth + '\'' +
                ", daySum=" + daySum +
                '}';
    }
}
