package com.xiaoji.gtd.service;

/**
 * 短信类接口
 *
 * create by wzy on 2018/11/16.
 */
public interface ISmsService {

    /**
     * 获取短信验证码
     * @param mobile
     * @return
     */
    int getAuthCode(String mobile);

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
