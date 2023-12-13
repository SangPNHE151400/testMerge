package fpt.capstone.buildingmanagementsystem;

import fpt.capstone.buildingmanagementsystem.repository.RequestMessageRepository;
import fpt.capstone.buildingmanagementsystem.service.LcdService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BuildingManagementSystemApplicationTests {
    @Autowired
    RequestMessageRepository requestMessageRepository;

    @Autowired
    LcdService service;

//    @Test
//    void contextLoads() {
//        String json = "{\n" +
//                "\"operator\": \"RecPush\",\n" +
//                "\"info\": {\n" +
//                "\"customId\":\" \",\n" +
//                "\"personId\":\"10\",\n" +
//                "\"RecordID\":\"143\",\n" +
//                "\"VerifyStatus\":\"1\",\n" +
//                "\"PersonType\":\"0\",\n" +
//                "\"similarity1\":\"90.500000\",\n" +
//                "\"similarity2\":\"0.000000\",\n" +
//                "\"Sendintime\":1,\n" +
//                "\"direction\":\"exit\",\n" +
//                "\"otype\":\"1\",\n" +
//                "\"persionName\":\"managertech3\",\n" +
//                "\"facesluiceId\":\"2032105\",\n" +
//                "\"facesluiceName\":\"Face1\",\n" +
//                "\"idCard\":\" \",\n" +
//                "\"telnum\":\" \",\n" +
//                "\"time\":\"2023-11-22 19:15:00\",\n" +
//                "\"PushType\": \"0\",\n" +
//                "\"OpendoorWay\": \"0\",\n" +
//                "\"cardNum2\": \"1\",\n" +
//                "\"szQrCodeData\":\"\",\n" +
//                "\"temperature\": \"0.0\",\n" +
//                "\"temperatureAlarm\": \"0\",\n" +
//                "\"temperatureMode\": \"0\",\n" +
//                "\"dwFileIndex\": \"0\",\n" +
//                "\"dwFilePos\": \"15269888\",\n" +
//                "\"pic\": \"data:image/jpeg;base64,abc\"\n" +
//                "}}\n";
//        System.out.println(service.ExtractJsonLcdLog(json));
//    }

}
