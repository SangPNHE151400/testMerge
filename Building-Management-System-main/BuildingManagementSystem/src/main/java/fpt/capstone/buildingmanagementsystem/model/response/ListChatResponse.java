package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ListChatResponse {
    String chatId;
    String chatName;
    String isGroupChat;
    List<String> avatar;
    List<UserInfoResponse> user;
    Date updateAt;
    String read;
    String admin;
}
