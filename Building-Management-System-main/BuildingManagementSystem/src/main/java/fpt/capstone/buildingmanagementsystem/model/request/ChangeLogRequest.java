package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChangeLogRequest {
    private String employeeId;
    private int month;
    private Date date;
}
