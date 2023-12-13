package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ControlLogStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AccountLcdResponse {

    private String deviceAccountId;

    private String accountId;

    private String userName;

    private String firstName;

    private String lastName;

    private Department department;

    private Date startDate;

    private Date endDate;

    private ControlLogStatus status;

    private String messageSetupMqtt;
}
