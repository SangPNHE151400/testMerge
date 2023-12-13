package fpt.capstone.buildingmanagementsystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDto {
    String accountId;
    String firstName;
    String lastName;
    String image;
    String roleName;
}
