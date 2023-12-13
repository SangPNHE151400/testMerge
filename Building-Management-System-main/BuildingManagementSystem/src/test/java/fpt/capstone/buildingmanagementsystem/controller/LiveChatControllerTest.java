package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.*;
import fpt.capstone.buildingmanagementsystem.model.response.*;
import fpt.capstone.buildingmanagementsystem.service.LiveChatService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import static org.mockito.Mockito.*;

class LiveChatControllerTest {
    @Mock
    LiveChatService liveChatService;
    @InjectMocks
    LiveChatController liveChatController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateNewChat() {
        when(liveChatService.createChat(any())).thenReturn(new ListChatResponse("chatId", "chatName", "isGroupChat", List.of("String"), List.of(new UserInfoResponse("accountId", "username", "firstName", "lastName", "image", "roleName")), new GregorianCalendar(2023, Calendar.DECEMBER, 7, 22, 25).getTime(), "read", "admin"));

        ListChatResponse result = liveChatController.createNewChat(new CreateChatRequest("from", "chatName", List.of("String"), "message"));
        Assertions.assertEquals(new ListChatResponse("chatId", "chatName", "isGroupChat", List.of("String"), List.of(new UserInfoResponse("accountId", "username", "firstName", "lastName", "image", "roleName")), new GregorianCalendar(2023, Calendar.DECEMBER, 7, 22, 25).getTime(), "read", "admin"), result);
    }
    //pass

    @Test
    void testCreateNewMessage() {
        when(liveChatService.newChatMessage(any())).thenReturn(new MessageImageAndFileResponse("messageId", "message", "senderId"));

        MessageImageAndFileResponse result = liveChatController.createNewMessage(new ChatMessageRequest("from", "chatId", "message"));
        Assertions.assertEquals(new MessageImageAndFileResponse("messageId", "message", "senderId"), result);
    }
    //note 2

    @Test
    void testCreateNewMessage2() throws IOException {
        when(liveChatService.newChatMessage2(anyString(), any())).thenReturn(new MessageImageAndFileResponse("messageId", "message", "senderId"));

        MessageImageAndFileResponse result = liveChatController.createNewMessage2("data", null);
        Assertions.assertEquals(new MessageImageAndFileResponse("messageId", "message", "senderId"), result);
    }
    //update

    @Test
    void testCreateNewMessage3() throws IOException {
        when(liveChatService.newChatMessage3(anyString(), any())).thenReturn(new MessageImageAndFileResponse("messageId", "message", "senderId"));

        MessageImageAndFileResponse result = liveChatController.createNewMessage3("data", null);
        Assertions.assertEquals(new MessageImageAndFileResponse("messageId", "message", "senderId"), result);
    }


    @Test
    void testGetAllChatUserSingle() {
        when(liveChatService.getAllChatUserSingle(anyString())).thenReturn(List.of(new UserInfoResponse("accountId", "username", "firstName", "lastName", "image", "roleName")));

        List<UserInfoResponse> result = liveChatController.getAllChatUserSingle(new GetUserInfoRequest("userId"));
        Assertions.assertEquals(List.of(new UserInfoResponse("accountId", "username", "firstName", "lastName", "image", "roleName")), result);
    }
    //pass

    @Test
    void testGetAllChat() {
        when(liveChatService.getAllChat(anyString())).thenReturn(List.of(new ListChatResponse("chatId", "chatName", "isGroupChat", List.of("String"), List.of(new UserInfoResponse("accountId", "username", "firstName", "lastName", "image", "roleName")), new GregorianCalendar(2023, Calendar.DECEMBER, 7, 22, 25).getTime(), "read", "admin")));

        List<ListChatResponse> result = liveChatController.getAllChat(new GetUserInfoRequest("userId"));
        Assertions.assertEquals(List.of(new ListChatResponse("chatId", "chatName", "isGroupChat", List.of("String"), List.of(new UserInfoResponse("accountId", "username", "firstName", "lastName", "image", "roleName")), new GregorianCalendar(2023, Calendar.DECEMBER, 7, 22, 25).getTime(), "read", "admin")), result);
    }

    @Test
    void testUpdateChat() {
        when(liveChatService.updateChat(any())).thenReturn(new ListChatResponse("chatId", "chatName", "isGroupChat", List.of("String"), List.of(new UserInfoResponse("accountId", "username", "firstName", "lastName", "image", "roleName")), new GregorianCalendar(2023, Calendar.DECEMBER, 7, 22, 25).getTime(), "read", "admin"));

        ListChatResponse result = liveChatController.updateChat(new UpdateGroupChatRequest("chatId", "isGroup", "chatName", List.of("String")));
        Assertions.assertEquals(new ListChatResponse("chatId", "chatName", "isGroupChat", List.of("String"), List.of(new UserInfoResponse("accountId", "username", "firstName", "lastName", "image", "roleName")), new GregorianCalendar(2023, Calendar.DECEMBER, 7, 22, 25).getTime(), "read", "admin"), result);
    }
    //try upload file

    @Test
    void testRemoveFromChat() {
        when(liveChatService.removeFromChat(any())).thenReturn(true);

        boolean result = liveChatController.removeFromChat(new RemoveUserAndChangeAdminRequest("chatId", "userId"));
        Assertions.assertEquals(true, result);
    }
    //test

    @Test
    void testReadChat() {
        when(liveChatService.readChat(any())).thenReturn(true);

        boolean result = liveChatController.readChat(new RemoveUserAndChangeAdminRequest("chatId", "userId"));
        Assertions.assertEquals(true, result);
    }
    //v2

    @Test
    void testUpdateChange() {
        when(liveChatService.updateChange(any())).thenReturn(true);

        boolean result = liveChatController.updateChange(new RemoveUserAndChangeAdminRequest("chatId", "userId"));
        Assertions.assertEquals(true, result);
    }
    //Fix expected 2

}
//done fix