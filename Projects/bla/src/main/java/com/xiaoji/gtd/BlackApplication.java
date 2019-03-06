package com.xiaoji.gtd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * SpringBoot 启动类
 *
 */
@SpringBootApplication
@EnableTransactionManagement
public class BlackApplication extends SpringBootServletInitializer{
    public static void main(String[] args) {
        SpringApplication.run(BlackApplication.class, args);
    }
    
    @Override 
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
    	return builder.sources(BlackApplication.class);
	}
}
