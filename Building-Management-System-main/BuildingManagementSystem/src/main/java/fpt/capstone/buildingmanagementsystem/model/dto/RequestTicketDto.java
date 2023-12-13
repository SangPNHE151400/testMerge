package fpt.capstone.buildingmanagementsystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestTicketDto {
    private String requestId;
    private String title;
    private String requestCreateDate;
    private String requestUpdateDate;
    private String requestStatus;
    private String userId;
}
