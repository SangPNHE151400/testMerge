package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class ChatMessageResponse {
    private List<String> chatUserIds;
    private String sender;
    private String receiver;
    private String message;
    private String type;
    private String createAt;
    private String updateAt;
}
