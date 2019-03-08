package com.xiaoji.sms.services;

/**
 * 短信类接口
 *
 */
public interface ISmsService {

    /**
     * 获取短信验证码
     * @param mobile
     * @return
     */
    int getAuthCode(String mobile,String code);

    /**
     * 推送短信日程
     * @param mobile
     * @return
     */
    int pushSchedule(String mobile);

    /**
     * 推送好友邀请
     * @param mobile
     * @return
     */
    int pushPlayer(String mobile);
}
