package com.xiaoji.gtd.dto.player;

/**
 * 参与人添加类
 *
 * create by wzy on 2019/01/17
 */
public class PlayerInData {

    private String targetUserId;
    private String targetMobile;

    public String getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(String targetUserId) {
        this.targetUserId = targetUserId;
    }

    public String getTargetMobile() {
        return targetMobile;
    }

    public void setTargetMobile(String targetMobile) {
        this.targetMobile = targetMobile;
    }
}
