package com.xiaoji.config.interceptor;

import java.lang.annotation.*;

/**
 * 作用于方法上
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AuthCheck {
}
