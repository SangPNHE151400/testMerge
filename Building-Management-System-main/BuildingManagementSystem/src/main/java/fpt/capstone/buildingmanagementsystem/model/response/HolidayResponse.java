package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class HolidayResponse {
    String holidayId;
    private String title;
    private String content;
    private Date fromDate;
    private Date toDate;
    String username;
}
