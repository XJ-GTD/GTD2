//package com.manager.config;
//
//import com.manager.config.security.SecurityProperties;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.SpringBootConfiguration;
//import org.springframework.context.annotation.Bean;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
///**
// * Security 安全认证
// *
// * create by wzy on 2018/08/28
// */
//@SpringBootConfiguration
//public class SecurityConfig extends WebSecurityConfigurerAdapter {
//
//    private final SecurityProperties securityProperties;
//
//    @Autowired
//    public SecurityConfig(SecurityProperties securityProperties) {
//        this.securityProperties = securityProperties;
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//
//        http.formLogin()
//                    .loginPage(securityProperties.getLoginProperties().getLoginPage())      //用户未认证时，转跳到认证的页面
//                    .loginProcessingUrl(securityProperties.getLoginProperties().getLoginProcessingUrl())    //form中action的地址，也就是处理认证请求的URL
//                    .usernameParameter(securityProperties.getLoginProperties().getUsernameParameter())      //form中用户名密码的name名
//                    .passwordParameter(securityProperties.getLoginProperties().getPasswordParameter())      //form中用户名密码的name名
//                    .defaultSuccessUrl(securityProperties.getLoginProperties().getDefaultSuccessUrl())      //认证成功后默认转跳的URL
//                .and()
//                    .authorizeRequests()
//                        .antMatchers(securityProperties.getLoginProperties().getLoginPage(),securityProperties.getLoginProperties().getLoginProcessingUrl()).permitAll()
//                        .anyRequest().authenticated()
//                .and()
//                .csrf().disable();
//    }
//}
