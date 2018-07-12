package com.task.springbootrabbitmq.dto;

import java.io.Serializable;

/**
 * 用户类
 *
 * create by wzy on 2018/07/12
 */
public class UserTaskDto implements Serializable {
    private String userName;    //用户昵称
    private String headImg;     //头像
    private String taskName;    //任务名
    private String taskContent; //任务内容

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getHeadImg() {
        return headImg;
    }

    public void setHeadImg(String headImg) {
        this.headImg = headImg;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getTaskContent() {
        return taskContent;
    }

    public void setTaskContent(String taskContent) {
        this.taskContent = taskContent;
    }
}
