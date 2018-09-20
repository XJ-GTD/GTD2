package com.manager.master.dto;

/**
 * 推送信息类
 *
 * create by wzy on 2018/09/12
 */
public class PushOutDto {

    private String messageName;     //新消息主题： schedule Name日程主题 / groupName  群族名
    private Integer messageId;      //新消息ID： scheduleId / groupId
    private String messageContent;      //新消息内容： 告知用户邀请详详情
    private String userName;        //推送人名称
    private Integer type;       //新消息类型： 1 日程  /  2 群组      /3消息反馈

    public String getMessageName() {
        return messageName;
    }

    public void setMessageName(String messageName) {
        this.messageName = messageName;
    }

    public Integer getMessageId() {
        return messageId;
    }

    public void setMessageId(Integer messageId) {
        this.messageId = messageId;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
