package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.Conflict;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.Role;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationViewer;
import fpt.capstone.buildingmanagementsystem.model.request.NotificationDetailRequest;
import fpt.capstone.buildingmanagementsystem.model.request.PersonalPriorityRequest;
import fpt.capstone.buildingmanagementsystem.model.request.UnReadRequest;
import fpt.capstone.buildingmanagementsystem.model.response.*;
import fpt.capstone.buildingmanagementsystem.repository.UnreadMarkRepository;
import fpt.capstone.buildingmanagementsystem.service.NotificationService;
import fpt.capstone.buildingmanagementsystem.service.NotificationServiceV2;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.List;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


@ExtendWith(SpringExtension.class)
@SpringBootTest
class NotificationControllerTest {
    @Autowired
    UnreadMarkRepository unreadMarkRepository;

    @Autowired
    NotificationService notificationService;
    @Autowired
    NotificationServiceV2 notificationServiceV2;
    @Autowired
    NotificationController notificationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveNewNotification() throws Exception {
        MockMultipartFile imageFile = createMockMultipartFile("image", "R1.jpg");

        MockMultipartFile docxFile = createMockMultipartFile("file", "gpt.txt");

        String jsonData = "{ \"buttonStatus\": \"upload\"," +
                " \"userId\": \"3f103761-d5bf-4686-a435-9c32d648ceca\"," +
                " \"title\": \"Noti  upload 4\"," +
                " \"sendAllStatus\": false," +
                " \"receiverId\":[\"55fd796e-6e33-4b17-b6d9-d32aef9fce3f\"]," +
                " \"priority\": true," +
                " \"content\": \"Noti upload 4\"," +
                " \"uploadDatePlan\": \"2023-11-24 19:40:00\"}";

        boolean result = notificationController.saveNewNotification(jsonData, new MockMultipartFile[]{imageFile}, new MockMultipartFile[]{docxFile});
        assertEquals(true, result);
    }
    //update result

    private MockMultipartFile createMockMultipartFile(String paramName, String fileName) throws Exception {
        Path filePath = Paths.get("D:\\Wallpaper\\" + fileName);
        String originalFileName = fileName;
        String contentType = Files.probeContentType(filePath);
        byte[] content = Files.readAllBytes(filePath);
        return new MockMultipartFile(paramName, originalFileName, contentType, content);
    }

    @Test
    void testEditNotification() throws Exception {
        String user_id = "";

        boolean result = notificationController.editNotification("data", new MultipartFile[]{null}, new MultipartFile[]{null});
        Assertions.assertEquals(true, result);
    }


    //
    @Test
    void testGetAllNotificationByUser() {
        String user_id2="???Adfsdfgs";
        String user_id="55fd796e-6e33-4b17-b6d9-d32aef9fce3f";

        NotificationTitleResponse result = notificationController.getAllNotificationByUser(user_id);

        assertEquals(30, result.getTotal());
    }

    @Test
    void testGetListNotificationByUserId() {
        String creator_userId = "11dea336-8be4-4399-bce6-c57d510b5275";

        List<NotificationDetailResponse> result = notificationController.getListNotificationByUserId(creator_userId);
        assertNotNull(result);
        assertEquals(8, result.size());
    }

    @Test
    void testGetListUploadedNotificationByCreator() {
        String creator_userId = "11dea336-8be4-4399-bce6-c57d510b5275";

        List<NotificationDetailResponse> result = notificationController.getListUploadedNotificationByCreator(creator_userId);

        assertNotNull(result);
        assertEquals(5, result.size());
    }

    @Test
    void testGetListUploadedNotificationByUserId() {
        String userId = "94b38a94-bb4a-4adb-acc9-34bde9babd4e";

        List<NotificationDetailResponse> result = notificationController.getListUploadedNotificationByUserId(userId);
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void testGetListDraftNotificationByUserId() {
        String userId = "11dea336-8be4-4399-bce6-c57d510b5275";

        List<NotificationDetailResponse> result = notificationController.getListDraftNotificationByUserId(userId);
        assertNotNull(result);
        assertEquals(4, result.size());
    }

    @Test
    void testGetListScheduledNotificationByUserId() {
        String userId = "3a5cccac-9490-4b9b-9e1e-16ce220b35cb";

        List<NotificationDetailResponse> result = notificationController.getListScheduledNotificationByUserId(userId);
        assertNotNull(result);
        assertEquals(3, result.size());
    }

    /////bat loi nua
    @Test
    void testMarkToReadByNotification() {
        UnReadRequest unReadRequest = new UnReadRequest();
        unReadRequest.setNotificationId("d011710d-80e6-463c-ac9f-b3b419bae32c");
        unReadRequest.setUserId("0dff5d5c-095d-4386-91f2-82bdb7eba342");

        boolean result = notificationController.markToReadByNotification(unReadRequest);

        assertEquals(true, result);
    }

    @Test
    void testMarkToReadByNotification_NotFoundNotification() {
        UnReadRequest unReadRequest = new UnReadRequest();
        unReadRequest.setNotificationId("@@1242jbksdjbg");
        unReadRequest.setUserId("0dff5d5c-095d-4386-91f2-82bdb7eba342");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.markToReadByNotification(unReadRequest));
        assertEquals("Not_found_notification", exception.getMessage());
    }

    @Test
    void testMarkToReadByNotification_NotFoundUser() {
        UnReadRequest unReadRequest = new UnReadRequest();
        unReadRequest.setNotificationId("d011710d-80e6-463c-ac9f-b3b419bae32c");
        unReadRequest.setUserId("@@@1235dfg");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.markToReadByNotification(unReadRequest));
        assertEquals("Not_found_user", exception.getMessage());
    }

    @Test
    void testMarkToReadByNotification_NotFoundUnreadNotification() {
        UnReadRequest unReadRequest = new UnReadRequest();
        unReadRequest.setNotificationId("d011710d-80e6-463c-ac9f-b3b419bae32c");
        unReadRequest.setUserId("0dff5d5c-095d-4386-91f2-82bdb7eba342");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.markToReadByNotification(unReadRequest));
        assertEquals("Not_found_unread_notification", exception.getMessage());
    }



    @Test
    void testMarkToUnReadByNotification() {
        UnReadRequest unReadRequest = new UnReadRequest();
        unReadRequest.setNotificationId("d011710d-80e6-463c-ac9f-b3b419bae32c");
        unReadRequest.setUserId("0dff5d5c-095d-4386-91f2-82bdb7eba342");

        boolean result = notificationController.markToUnReadByNotification(unReadRequest);

        assertEquals(true, result);
    }

    @Test
    void testMarkToUnReadByNotification_NotFoundNotification() {
        UnReadRequest unReadRequest = new UnReadRequest();
        unReadRequest.setNotificationId("@131rgdg");
        unReadRequest.setUserId("0dff5d5c-095d-4386-91f2-82bdb7eba342");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.markToUnReadByNotification(unReadRequest));
        assertEquals("Not_found_notification", exception.getMessage());
    }

    @Test
    void testMarkToUnReadByNotification_NotFoundUser() {
        UnReadRequest unReadRequest = new UnReadRequest();
        unReadRequest.setNotificationId("d011710d-80e6-463c-ac9f-b3b419bae32c");
        unReadRequest.setUserId("saffghegfd1234435123");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.markToUnReadByNotification(unReadRequest));
        assertEquals("Not_found_user", exception.getMessage());
    }

    @Test
    void testSetPersonalPriority() {
        PersonalPriorityRequest personalPriorityRequest = new PersonalPriorityRequest();
        personalPriorityRequest.setNotificationId("f3f175dd-a857-4f54-9708-0abe077df76c");
        personalPriorityRequest.setUserId("94b38a94-bb4a-4adb-acc9-34bde9babd4e");

        boolean result = notificationController.setPersonalPriority(personalPriorityRequest);
        Assertions.assertEquals(true, result);
    }

    @Test
    void testSetPersonalPriority_NotFoundNotification() {
        PersonalPriorityRequest personalPriorityRequest = new PersonalPriorityRequest();
        personalPriorityRequest.setNotificationId("fdghd@!#%%$");
        personalPriorityRequest.setUserId("94b38a94-bb4a-4adb-acc9-34bde9babd4e");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.setPersonalPriority(personalPriorityRequest));
        assertEquals("Not_found_notification", exception.getMessage());
    }

    @Test
    void testSetPersonalPriority_NotFoundUser() {
        PersonalPriorityRequest personalPriorityRequest = new PersonalPriorityRequest();
        personalPriorityRequest.setNotificationId("f3f175dd-a857-4f54-9708-0abe077df76c");
        personalPriorityRequest.setUserId("!@#$%??@#");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.setPersonalPriority(personalPriorityRequest));
        assertEquals("Not_found_user", exception.getMessage());
    }

    @Test
    void testUnsetPersonalPriority() {
        PersonalPriorityRequest personalPriorityRequest = new PersonalPriorityRequest();
        personalPriorityRequest.setNotificationId("f3f175dd-a857-4f54-9708-0abe077df76c");
        personalPriorityRequest.setUserId("94b38a94-bb4a-4adb-acc9-34bde9babd4e");

        boolean result = notificationController.unsetPersonalPriority(personalPriorityRequest);
        Assertions.assertEquals(true, result);
    }

    @Test
    void testUnsetPersonalPriority_NotFoundNotification() {
        PersonalPriorityRequest personalPriorityRequest = new PersonalPriorityRequest();
        personalPriorityRequest.setNotificationId("?@#@$@#%?#$^#???");
        personalPriorityRequest.setUserId("94b38a94-bb4a-4adb-acc9-34bde9babd4e");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.unsetPersonalPriority(personalPriorityRequest));
        assertEquals("Not_found_notification", exception.getMessage());
    }

    @Test
    void testUnsetPersonalPriority_NotFoundUser() {
        PersonalPriorityRequest personalPriorityRequest = new PersonalPriorityRequest();
        personalPriorityRequest.setNotificationId("f3f175dd-a857-4f54-9708-0abe077df76c");
        personalPriorityRequest.setUserId("?!@#%WDF!@%&");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.unsetPersonalPriority(personalPriorityRequest));
        assertEquals("Not_found_user", exception.getMessage());
    }

    @Test
    void testGetNotificationByUserIdAndNotificationId() {
        //userid  =receiverid
        NotificationDetailRequest detailRequest = new NotificationDetailRequest();
        detailRequest.setNotificationId("1234ae24-0d26-42f8-8293-832fb5c30ce4");
        detailRequest.setUserId("55fd796e-6e33-4b17-b6d9-d32aef9fce3f");

        NotificationDetailResponseForDetail result = notificationController.getNotificationByUserIdAndNotificationId(detailRequest);

        Assertions.assertEquals("1234ae24-0d26-42f8-8293-832fb5c30ce4", result.getNotificationId());
        Assertions.assertEquals("Noti 4", result.getTitle());
        Assertions.assertEquals("Noti 4", result.getContent());
        Assertions.assertEquals(Timestamp.valueOf("2023-11-16 21:16:01"), result.getCreatedDate());
        Assertions.assertEquals(Timestamp.valueOf("2023-11-16 21:16:01"), result.getUploadDate());
        Assertions.assertEquals(NotificationStatus.UPLOADED, result.getNotificationStatus());
        Assertions.assertEquals(true, result.isPriority());
        Assertions.assertEquals("0dff5d5c-095d-4386-91f2-82bdb7eba342", result.getCreatorId());
        Assertions.assertEquals("unknown", result.getFirstName());
        Assertions.assertEquals("unknown", result.getLastName());
        Assertions.assertEquals("1", result.getRole().getRoleId());
        Assertions.assertEquals("hr", result.getRole().getRoleName());
        Assertions.assertEquals("minhhaha", result.getUserName());
        Assertions.assertEquals("2", result.getCreatorDepartment().getDepartmentId());
        Assertions.assertEquals("tech D1", result.getCreatorDepartment().getDepartmentName());
        Assertions.assertEquals("unknown", result.getCreatorImage());
        Assertions.assertEquals(false, result.isPersonalPriority());
        Assertions.assertEquals(Collections.emptyList(), result.getNotificationFiles());
        Assertions.assertEquals(Collections.emptyList(), result.getNotificationImages());

    }

    @Test
    void testGetNotificationByUserIdAndNotificationId_NotFoundUser() {
        //userid  =receiverid
        NotificationDetailRequest detailRequest = new NotificationDetailRequest();
        detailRequest.setNotificationId("1234ae24-0d26-42f8-8293-832fb5c30ce4");
        detailRequest.setUserId("invalid_user_id");

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> notificationController.getNotificationByUserIdAndNotificationId(detailRequest));
        assertEquals("not_found_user", exception.getMessage());
    }

    @Test
    void testGetNotificationByUserIdAndNotificationId_NotFoundNotification() {
        //userid  =receiverid
        //userid and notificationid not match
        NotificationDetailRequest detailRequest = new NotificationDetailRequest();
        detailRequest.setNotificationId("1234ae24-0d26-42f8-8293-832fb5c30ce4");
        detailRequest.setUserId("07644394-789a-46f4-91d1-69d3e8e09fec");

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> notificationController.getNotificationByUserIdAndNotificationId(detailRequest));
        assertEquals("not_found_notification", exception.getMessage());
    }

    @Test
    void testGetNotificationByUserIdAndNotificationId_HiddenCase() {
        //userid  =receiverid and Notification is hidden
        NotificationDetailRequest detailRequest = new NotificationDetailRequest();
        detailRequest.setNotificationId("7bf6f3e3-ec7a-419a-9c8f-f403418c6175");
        detailRequest.setUserId("07644394-789a-46f4-91d1-69d3e8e09fec");

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> notificationController.getNotificationByUserIdAndNotificationId(detailRequest));
        assertEquals("Not_found_notification", exception.getMessage());
    }

    @Test
    void testGetNotificationByCreatorAndNotificationId() {
        NotificationDetailRequest detailRequest = new NotificationDetailRequest();
        detailRequest.setUserId("07644394-789a-46f4-91d1-69d3e8e09fec");
        detailRequest.setNotificationId("0445e70d-c4c7-491c-bbcd-62c713f52844");

        NotificationDetailResponseForCreator result = notificationController.getNotificationByCreatorAndNotificationId(detailRequest);

        Assertions.assertEquals("0445e70d-c4c7-491c-bbcd-62c713f52844", result.getNotificationId());
        Assertions.assertEquals("[SYSTEM] You have a new ticket request.", result.getTitle());
        Assertions.assertEquals("Ticket Id: LT_2e3773e7-ca68-47bd-adb3-9f9aa01e97bb<br>Topic: LATE_REQUEST\n", result.getContent());
        Assertions.assertEquals(Timestamp.valueOf("2023-11-21 15:48:18"), result.getUploadDate());
        Assertions.assertEquals(NotificationStatus.UPLOADED, result.getNotificationStatus());
        Assertions.assertEquals(false, result.isPriority());
        Assertions.assertEquals("07644394-789a-46f4-91d1-69d3e8e09fec", result.getCreatorId());
        Assertions.assertEquals("unknown", result.getFirstName());
        Assertions.assertEquals("unknown", result.getLastName());
        Assertions.assertEquals("unknown", result.getCreatorImage());
        Assertions.assertEquals(Collections.emptyList(), result.getNotificationFiles());
        Assertions.assertEquals(Collections.emptyList(), result.getNotificationImages());
    }

    @Test
    void testGetListScheduledNotificationByDepartmentOfCreator() {
        String user_id = "3a5cccac-9490-4b9b-9e1e-16ce220b35cb";

        List<NotificationDetailResponse> result = notificationController.getListScheduledNotificationByDepartmentOfCreator(user_id);
        Assertions.assertEquals(3, result.size());
    }

    @Test
    void testGetListScheduledNotificationByDepartmentOfCreator_NotFoundUser() {
        String user_id = "not_valid_user_id";

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> notificationController.getListScheduledNotificationByDepartmentOfCreator(user_id));
        assertEquals("not_found_user", exception.getMessage());
    }

    @Test
    void testSetNotificationHidden() {
        PersonalPriorityRequest setNotificationHidden = new PersonalPriorityRequest();
        setNotificationHidden.setUserId("07644394-789a-46f4-91d1-69d3e8e09fec");
        setNotificationHidden.setNotificationId("7bf6f3e3-ec7a-419a-9c8f-f403418c6175");

        boolean result = notificationController.setNotificationHidden(setNotificationHidden);
        Assertions.assertEquals(true, result);
    }
    //change return

    @Test
    void testSetNotificationHidden_NotFoundUser() {
        PersonalPriorityRequest setNotificationHidden = new PersonalPriorityRequest();
        setNotificationHidden.setUserId("A!@#@#????>!23");
        setNotificationHidden.setNotificationId("7bf6f3e3-ec7a-419a-9c8f-f403418c6175");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.setNotificationHidden(setNotificationHidden));
        assertEquals("Not_found_user", exception.getMessage());

    }
    //try catch 404

    @Test
    void testSetNotificationHidden_NotFoundNoti() {
        PersonalPriorityRequest setNotificationHidden = new PersonalPriorityRequest();
        setNotificationHidden.setUserId("07644394-789a-46f4-91d1-69d3e8e09fec");
        setNotificationHidden.setNotificationId("@???!@$@#$!123");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.setNotificationHidden(setNotificationHidden));
        assertEquals("Not_found_notification", exception.getMessage());

    }

    @Test
    void testDeleteNotification() {
        PersonalPriorityRequest deleteNotification = new PersonalPriorityRequest();
        deleteNotification.setNotificationId("e0ef8126-7d82-4544-9450-5445f73cdef2");
        deleteNotification.setUserId("3a5cccac-9490-4b9b-9e1e-16ce220b35cb");

        boolean result = notificationController.deleteNotification(deleteNotification);
        Assertions.assertEquals(true, result);
    }

    @Test
    void testDeleteNotification_NotFoundNotification() {
        PersonalPriorityRequest deleteNotification = new PersonalPriorityRequest();
        deleteNotification.setNotificationId("not_valid_notificatio_id");
        deleteNotification.setUserId("3a5cccac-9490-4b9b-9e1e-16ce220b35cb");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.deleteNotification(deleteNotification));
        assertEquals("Not_found_notification", exception.getMessage());
    }

    @Test
    void testDeleteNotification_NotFoundUser() {
        PersonalPriorityRequest deleteNotification = new PersonalPriorityRequest();
        deleteNotification.setNotificationId("e0ef8126-7d82-4544-9450-5445f73cdef2");
        deleteNotification.setUserId("not_a_valid_user_id");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.deleteNotification(deleteNotification));
        assertEquals("Not_found_user", exception.getMessage());
    }

    @Test
    void testDeleteNotification_NotCreatorID() {
        PersonalPriorityRequest deleteNotification = new PersonalPriorityRequest();
        deleteNotification.setNotificationId("e0ef8126-7d82-4544-9450-5445f73cdef2");
        //notiID not match userID
        deleteNotification.setUserId("11dea336-8be4-4399-bce6-c57d510b5275");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> notificationController.deleteNotification(deleteNotification));
        assertEquals("request_fail", exception.getMessage());
    }

    @Test
    void testDeleteNotification_NotificationUploaded() {
        PersonalPriorityRequest deleteNotification = new PersonalPriorityRequest();
        //notification uploaded
        deleteNotification.setNotificationId("0fd27d1d-a2bf-4efb-bcfe-0d3f0b39bf92");
        deleteNotification.setUserId("0dff5d5c-095d-4386-91f2-82bdb7eba342");

        Conflict exception = org.junit.jupiter.api.Assertions.assertThrows(Conflict.class,
                () -> notificationController.deleteNotification(deleteNotification));
        assertEquals("Notification_Upload", exception.getMessage());
    }
}
