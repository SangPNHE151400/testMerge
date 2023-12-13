package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.EvaluateEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MonthlyEvaluateSummaryResponse {
    private String evaluateId;
    private String employeeId;
    private String employeeUserName;
    private String employeeFirstName;
    private String employeeLastName;
    private Department department;
    private double paidDay;
    private int month;
    private int year;
    private EvaluateEnum rate;
    private Date approvedDate;
}
