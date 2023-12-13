package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetAllAccountResponse {
    String accountId;
    String username;
    String firstName;
    String lastName;
    String roleName;
    String statusName;
    String statusId;
    String createdBy;
    Date createdDate;
    String departmentName;
    String phone;
    String email;
    String gender;
}
