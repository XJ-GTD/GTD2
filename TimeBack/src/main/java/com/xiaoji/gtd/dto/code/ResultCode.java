package com.xiaoji.gtd.dto.code;

public enum ResultCode {
    // 成功
    SUCCESS(0),

    REPEAT_MOBILE(10101),                 //手机号重复
    REPEAT_UUID(10102),                   //用户ID重复

    REPEAT_PLAYER(10200),                   //好友添加重复

    NULL_UUID(11001),                     //用户ID为空
    NULL_MOBILE(11002),                   //手机号为空
    NULL_DEVICE_ID(11003),                 //设备ID为空
    NULL_PASSWORD(11004),                 //密码为空
    NULL_ACCOUNT(11005),                  //账户名为空
    NULL_OLD_PASSWORD(11006),             //旧密码为空
    NULL_SKILL_TYPE(11007),               //技能类型为空
    NULL_SCHEDULE_ID(11008),              //日程id为空
    NULL_SCHEDULE_NAME(11009),            //日程主题为空
    NULL_PLAYER(11010),                   //参与人为空
    NULL_TIME(11011),                     //时间为空

    NULL_AUTH_CODE(11101),                  //验证码为空

    NULL_XF_AUDIO(11201),                 //讯飞语音输入为空
    NULL_XF_TEXT(11202),                  //讯飞文本输入为空

    NOT_USER(11500),                       //用户尚未注册
    NOT_PLAYER(11501),                      //没有添加好友
    NOT_AUTH_PLAYER(11502),                  //已被好友拉黑


    ERROR_UUID(20001),                     //用户ID错误
    ERROR_MOBILE(20002),                   //手机号错误
    ERROR_PASSWORD(20003),                 //密码错误
    ERROR_AUTH_CODE(20004),                 //验证码错误
    ERROR_TOKEN(20005),                     //TOKEN验证错误
    ERROR_USERNAME(20006),                  //用户名错误
    ERROR_SKILL_TYPE(20007),                //技能类型错误

    EXPIRE_AUTH_CODE(21001),                //验证码过期
    EXPIRE_TOKEN(21002),                   //token过期

    FAIL_BUSIC(50000),                     //失败统一处理
	FAIL_SIGNUP(50100),                    //注册失败
    FAIL_AUTH(50101),                      //登陆验证失败
    FAIL_SMS(50102),                       //短信获取失败
    FAIL_SEARCH(50103),                    //查询失败
    FAIL_SCHEDULE(50104),                   //日程处理失败
    FAIL_PLAYER(50105),                     //参与人处理失败
    FAIL_INIT(50200),                       //初始化同步失败

    FAIL_XF(50200),                         //讯飞语音调用失败
    FAIL_XF_SKILL(50201),                   //讯飞语音无对应技能

    FAIL_TOKEN(50500),                      //校验token失败


    // 未认证（签名错误）
    NOT_FOUND(401),
    //权限等级不足
    UN_AUTH_LEVEL(402),
    // 未认证（签名错误）
    UNAUTHORIZED(401),

    /** 未登录 */
    UN_AUTH_TOKEN(4401),
    /** 未授权，拒绝访问 */
    UN_AUTH_Z(4403),

    // 服务器内部错误
    INTERNAL_SERVER_ERROR(500);

    public int code;

    ResultCode(int code) {
        this.code = code;
    }
}
