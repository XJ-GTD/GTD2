package com.manager.master.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * 讯飞语音json解析类
 *
 * create by wzy on 2018/09/14
 */
public class AiUiDataDto {

    private Integer code;
    private List<String> userNameList;		//参与人
    private String scheduleName;						//日程主题
    private String scheduleStartTime;					//开始时间
    private String scheduleDeadline;					//结束时间
    private String speech;      //讯飞语音播报字段
    private String userText;      //用户语音播报字段

    private List<FindScheduleOutDto> scheduleCreateList;       // 查询自己创建的日程
    private List<FindScheduleOutDto> scheduleJoinList;      // 查询自己参与的日程

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public List<String> getUserNameList() {
        return userNameList;
    }

    public void setUserNameList(List<String> userNameList) {
        this.userNameList = userNameList;
    }

    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    public String getScheduleStartTime() {
        return scheduleStartTime;
    }

    public void setScheduleStartTime(String scheduleStartTime) {
        this.scheduleStartTime = scheduleStartTime;
    }

    public String getScheduleDeadline() {
        return scheduleDeadline;
    }

    public void setScheduleDeadline(String scheduleDeadline) {
        this.scheduleDeadline = scheduleDeadline;
    }

    public String getSpeech() {
        return speech;
    }

    public void setSpeech(String speech) {
        this.speech = speech;
    }

    public List<FindScheduleOutDto> getScheduleCreateList() {
        return scheduleCreateList;
    }

    public void setScheduleCreateList(List<FindScheduleOutDto> scheduleCreateList) {
        this.scheduleCreateList = scheduleCreateList;
    }

    public List<FindScheduleOutDto> getScheduleJoinList() {
        return scheduleJoinList;
    }

    public void setScheduleJoinList(List<FindScheduleOutDto> scheduleJoinList) {
        this.scheduleJoinList = scheduleJoinList;
    }

    public String getUserText() {
        return userText;
    }

    public void setUserText(String userText) {
        this.userText = userText;
    }
}
