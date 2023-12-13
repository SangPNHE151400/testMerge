package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangeInfoAcceptDetailsResponse {
    String username;
    String role;
    String department;
    String hireDate;
    String genderBefore;
    String firstNameBefore;
    String imageBefore;
    String lastNameBefore;
    String emailBefore;
    String dateOfBirthBefore;
    String phoneBefore;
    String addressBefore;
    String cityBefore;
    String countryBefore;
    String genderAfter;
    String firstNameAfter;
    String imageAfter;
    String lastNameAfter;
    String emailAfter;
    String dateOfBirthAfter;
    String phoneAfter;
    String addressAfter;
    String cityAfter;
    String countryAfter;
}
