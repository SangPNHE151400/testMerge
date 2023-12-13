package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeUserInfoRequest {
    String userId;
    String firstName;
    String lastName;
    String gender;
    String dateOfBirth;
    String telephoneNumber;
    String address;
    String country;
    String city;
    String email;
}
