package com.task.springbootrabbitmq;

import com.task.springbootrabbitmq.receiver.TaskReceiver1;
import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

/**
 * spring启动类
 *
 */
@SpringBootApplication
public class SpringbootRabbitmqApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringbootRabbitmqApplication.class, args);
    }
}
