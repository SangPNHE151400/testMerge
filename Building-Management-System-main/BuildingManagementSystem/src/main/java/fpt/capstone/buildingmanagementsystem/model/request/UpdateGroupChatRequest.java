package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class UpdateGroupChatRequest {
    String chatId;
    String isGroup;
    String chatName;
    List<String> userId;
}
