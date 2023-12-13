package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class CreateChatRequest {
    private String from;
    private String chatName;
    private List<String> to;
    private String message;
}
