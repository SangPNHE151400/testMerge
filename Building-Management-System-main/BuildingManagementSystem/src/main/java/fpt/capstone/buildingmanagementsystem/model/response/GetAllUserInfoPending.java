package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllUserInfoPending {
    String accountId;
    String username;
    String roleName;
    String firstName;
    String lastName;
    String departmentName;
    String createdDate;
    String AcceptedBy;
    String ApprovedDate;
}
