package com.xiaoji.sms.services;

/**
 * 短信类接口
 *
 */
public interface ISmsService {

    /**
     * 获取短信
     * @param mobile
     * @return
     */
    int sendSms(String mobile,String sendType,String code);

  
}
