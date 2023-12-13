package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetOvertimeListResponse {
    String username;
    String department;
    String date;
    List<OverTimeLogResponse> overTimeLogResponses;
}
