package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {
    List<MessageResponse> messageResponseList;
    List<UserChatResponse> users;
    String admin;
}
