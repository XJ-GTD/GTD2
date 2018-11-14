package com.xiaoji.util;

public enum ResultCode {
    // 成功
    SUCCESS(0),
    // 重复信息
    REPEAT(1),
    // 失败
    FAIL(-1),

    // 未认证（签名错误）
    NOT_FOUND(401),
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
