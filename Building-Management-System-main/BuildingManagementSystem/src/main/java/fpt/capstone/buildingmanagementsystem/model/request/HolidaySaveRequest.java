package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HolidaySaveRequest {
    String title;
    String content;
    String toDate;
    String fromDate;
    String userId;
}
