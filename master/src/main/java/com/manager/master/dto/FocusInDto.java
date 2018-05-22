package com.manager.master.dto;
/**
 * 个人关注表
 * create  zy 2018/5/10
 */
public class FocusInDto {

    private int  focusAllId;//关注ID（组群，日程，用户）
    private int  focusType;//关注类型（1组群，2日程，3用户）
    private int  focusNumber;//自增主键
    private int  userId;//用户ID

    public int getFocusAllId() {
        return focusAllId;
    }

    public void setFocusAllId(int focusAllId) {
        this.focusAllId = focusAllId;
    }

    public int getFocusType() {
        return focusType;
    }

    public void setFocusType(int focusType) {
        this.focusType = focusType;
    }

    public int getFocusNumber() {
        return focusNumber;
    }

    public void setFocusNumber(int focusNumber) {
        this.focusNumber = focusNumber;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
