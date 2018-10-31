package com.manager.master.service;

import java.util.List;

/**
 * 短信服务
 */
public interface ISmsServer {
    /**
     * 发送手机验证码
     * @param tel
     * @param type
     * @return  验证码
     */
    String sendMessage(String tel, String type);

    /**
     * 批量发送邀请
     * @param telList   收件手机号
     * @param sender    发件邀请人
     * @return          发送失败的手机号
     */
    List<String> sendMessage(List<String> telList, String sender);


    /**
     * 发送手机验证码
     * @param tel
     * @param type
     * @return  验证码
     */
    String sendMessagec(String tel, String type);

    /**
     * 批量发送邀请
     * @param telList   收件手机号
     * @param sender    发件邀请人
     * @return          发送失败的手机号
     */
    List<String> sendMessagec(List<String> telList, String sender);

    /**
     * 查找验证码
     * @param tel
     * @return
     */
    String findCode(String tel);

    /**
     * 移除验证码
     * @param tel
     * @return
     */
    String removeCode(String tel);


}
