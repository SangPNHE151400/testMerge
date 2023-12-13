package fpt.capstone.buildingmanagementsystem;

import fpt.capstone.buildingmanagementsystem.service.InitializationService;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.annotation.PostConstruct;
import javax.naming.Context;
import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class BuildingManagementSystemApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(BuildingManagementSystemApplication.class);
        InitializationService initDB = context.getBean(InitializationService.class);
        initDB.init();
    }
    @PostConstruct
    public void init(){
        // Setting Spring Boot SetTimeZone
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
    }
}