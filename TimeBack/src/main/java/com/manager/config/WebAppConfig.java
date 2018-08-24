package com.manager.config;

import org.springframework.boot.SpringBootConfiguration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 拦截器使用
 *
 * create by wzy on 2018/08/24
 */
@SpringBootConfiguration
public class WebAppConfig implements WebMvcConfigurer {

    /**
     * 配置拦截器
     */
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new InterceptorConfig())
                .addPathPatterns("/user/**");
    }
}
