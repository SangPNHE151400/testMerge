package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SendOtherFormRequest {
    String userId;
    String ticketId;
    String requestId;
    String title;
    String content;
    String departmentId;
    String receivedId;
}
