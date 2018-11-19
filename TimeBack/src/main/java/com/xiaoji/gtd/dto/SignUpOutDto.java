package com.xiaoji.gtd.dto;

/**
 * 用户登陆信息输出类
 *
 * create by wzy on 2018/04/26
 */
public class SignUpOutDto extends BaseOut{

    private String userId;                 //用户ID
    private String deviceId;      //设备ID


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
}
