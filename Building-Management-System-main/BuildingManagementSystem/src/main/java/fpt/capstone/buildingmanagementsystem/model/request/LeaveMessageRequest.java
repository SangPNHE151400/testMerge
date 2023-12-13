package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveMessageRequest {
    private String leaveRequestId;
    private String content;
}
