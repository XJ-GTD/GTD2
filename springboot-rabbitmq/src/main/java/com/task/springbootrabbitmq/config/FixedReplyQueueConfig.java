//package com.task.springbootrabbitmq.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.HandlerInterceptor;
//import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
//
//@Configuration
//public class FixedReplyQueueConfig extends WebMvcConfigurerAdapter {
//
//    @Bean
//    public FixedReplyQueueConfig FixedReplyQueueConfig() {
//        return new FixedReplyQueueConfig();
//    }
//
//    public void addInterceptors(InterceptorRegistry registry) {
//        // 多个拦截器组成一个拦截器链
//        // addPathPatterns 用于添加拦截规则
//        // excludePathPatterns 用户排除拦截
//        registry.addInterceptor((HandlerInterceptor) FixedReplyQueueConfig()).addPathPatterns("/**");
//        super.addInterceptors(registry);
//    }
//
//}
