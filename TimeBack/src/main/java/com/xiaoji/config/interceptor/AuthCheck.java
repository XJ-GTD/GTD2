package com.xiaoji.config.interceptor;

import java.lang.annotation.*;

/**
 * TOKEN验证注解：作用于方法上
 *
 * create by wzy on 2018/12/07
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AuthCheck {
}
