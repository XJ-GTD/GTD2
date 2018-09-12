package com.manager.master.dto;

/**
 * 推送给目标用户类
 *
 * create by wzy on 2018/09/11
 */
public class PushInDto {

    private Integer userId;         //用户ID
    private String data;            //推送数据 要求JSON格式字符串
    private String accountQueue;    //目标用户消息队列

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getAccountQueue() {
        return accountQueue;
    }

    public void setAccountQueue(String accountQueue) {
        this.accountQueue = accountQueue;
    }

}
