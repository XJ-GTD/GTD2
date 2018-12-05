package com.xiaoji.gtd.dto;

/**
 * 添加联系人
 *
 * create by wzy on 2018/12/05
 */
public class PlayerInDto {

    private String userId;
    private String targetUserId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(String targetUserId) {
        this.targetUserId = targetUserId;
    }
}
