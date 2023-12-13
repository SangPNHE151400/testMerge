package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListAllControlLogByStaffResponse {
    String username;
    String firstName;
    String lastName;
    String hireDate;
    String phone;
    String email;
    String gender;
    String verifyType;
}
