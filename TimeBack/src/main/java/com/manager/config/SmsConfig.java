package com.manager.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

//@Configuration
//@PropertySource("classpath:/sms.properties")
@Component
public class SmsConfig {
    @Value("${msg_appid}")
    private String appid;
    @Value("${msg_appkey}")
    private String appkey;
    @Value("${msg_signtype}")
    private String signtype;
//    @Value("#{'${msg_project}'.split(',')}")
    private List<String> project;


    public String getAppid() {
        return appid;
    }

    public String getAppkey() {
        return appkey;
    }

    public String getSigntype() {
        return signtype;
    }

    public List<String> getProject() {
        return project;
    }
}


