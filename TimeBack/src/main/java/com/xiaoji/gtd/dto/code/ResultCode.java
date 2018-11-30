package com.xiaoji.gtd.dto.code;

public enum ResultCode {
    // 成功
    SUCCESS(0),

    REPEAT_MOBILE(10101),                 //手机号重复
    REPEAT_UUID(10102),                   //用户ID重复

    NULL_UUID(11001),                     //用户ID为空
    NULL_MOBILE(11002),                   //手机号为空
    NULL_DEVICEID(11003),                 //设备ID为空
    NULL_PASSWORD(11004),                 //密码为空
    NULL_ACCOUNT(11005),                  //账户名为空

    NULL_XF_AUDIO(11201),                 //讯飞语音输入为空
    NULL_XF_TEXT(11202),                  //讯飞文本输入为空

    NULL_AUTHCODE(11101),                  //验证码为空


    ERROR_UUID(20001),                     //用户ID错误
    ERROR_MOBILE(20002),                   //手机号错误
    ERROR_PASSWORD(20003),                 //密码错误
    ERROR_AUTHCODE(20004),                 //验证码错误

    EXPIRE_AUTHCODE(21001),                //验证码过期

	FAIL_SIGNUP(50100),                    //注册失败
    FAIL_AUTH(50101),                      //登陆验证失败
    FAIL_SMS(50102),                       //短信获取失败
    FAIL_XF(50200),                         //讯飞语音调用失败


    // 未认证（签名错误）
    NOT_FOUND(401),
    //权限等级不足
    UNAUTH_LEVEL(402),
    // 未认证（签名错误）
    UNAUTHORIZED(401),

    /** 未登录 */
    UNAUTHEN(4401),
    /** 未授权，拒绝访问 */
    UNAUTHZ(4403),

    // 服务器内部错误
    INTERNAL_SERVER_ERROR(500);

    public int code;

    ResultCode(int code) {
        this.code = code;
    }
}
