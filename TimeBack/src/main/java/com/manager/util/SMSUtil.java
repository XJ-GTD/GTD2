package com.manager.util;

/**
 * 手机注册短信验证(正式发行才可以使用)
 *
 * create by wzy on 2018/09/05
 */
public class SMSUtil {
    // 短信应用SDK AppID
    int appid = 1400137533; // 1400开头

    // 短信应用SDK AppKey
    String appkey = "f37fea11f0e1b0add8354113c8e01e21";

    // 需要发送短信的手机号码
    String[] phoneNumbers = {};

    // 短信模板ID，需要在短信应用中申请
    int templateId = 7839; // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请
    //templateId7839 对应的内容是"您的验证码是: {1}"
    // 签名
    String smsSign = "小鸡管家"; // NOTE: 这里的签名"腾讯云"只是一个示例，真实的签名需要在短信控制台中申请，另外签名参数使用的是`签名内容`，而不是`签名ID`
}
