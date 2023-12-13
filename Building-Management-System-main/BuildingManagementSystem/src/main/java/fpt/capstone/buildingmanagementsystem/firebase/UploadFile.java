package fpt.capstone.buildingmanagementsystem.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class UploadFile {
    @Autowired
    Properties properties;

    @EventListener
    public void init(ApplicationReadyEvent event) {
        try {
            ClassPathResource serviceAccount = new ClassPathResource("/firebase.json");
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
                    .setStorageBucket(properties.getBucketName())
                    .build();

            FirebaseApp.initializeApp(options);

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
    @Data
    @Configuration
    @ConfigurationProperties(prefix = "firebase")
    public class Properties {

        private String bucketName;

        private String imageUrl;
    }

}

