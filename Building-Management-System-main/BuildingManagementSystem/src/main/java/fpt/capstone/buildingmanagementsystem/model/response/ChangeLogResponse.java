package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ChangeLogType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChangeLogResponse {

    private String changeLogId;

    private Time checkin;

    private Time checkout;

    private double outsideWork;

    private boolean violate;

    private String reason;

    private ChangeLogType changeType;

    private Date date;

    private java.util.Date createdDate;

    private String managerId;

    private String employeeId;

    private String userName;

    private String firstName;

    private String lastName;
}
