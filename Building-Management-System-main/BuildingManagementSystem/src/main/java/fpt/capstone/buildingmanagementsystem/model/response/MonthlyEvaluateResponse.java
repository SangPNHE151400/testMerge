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
public class MonthlyEvaluateResponse {
    private String evaluateId;
    private double workingDay;
    private double totalAttendance;
    private int lateCheckin;
    private int earlyCheckout;
    private double permittedLeave;
    private double nonPermittedLeave;
    private int violate;
    private double overTime;
    private double paidDay;
    private int month;
    private int year;
    private EvaluateEnum evaluateEnum;
    private String note;
    private Date createdDate;
    private Date updateDate;
    private String createdBy;
    private String UsernameCreatedBy;
    private String employeeId;
    private String employeeUserName;
    private String firstNameEmp;
    private String lastNameEmp;
    private Department department;
    private Date hireDate;
    private Date approvedDate;
    private boolean status;
    private String acceptedHrId;
    private String acceptedHrUserName;
    private String hrNote;
}
