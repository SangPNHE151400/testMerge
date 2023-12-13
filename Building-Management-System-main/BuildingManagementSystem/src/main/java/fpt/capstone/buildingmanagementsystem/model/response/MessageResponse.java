package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MessageResponse {
    private String messageId;
    private boolean myself;
    private String message;
    private String senderId;
    private String createdAt;
    private String type;
}
