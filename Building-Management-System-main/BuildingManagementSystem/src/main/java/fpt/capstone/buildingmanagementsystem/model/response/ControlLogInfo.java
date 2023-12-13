package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@Data
@NoArgsConstructor
public class ControlLogInfo {
    String avatar;
    String account;
    String role;
    String department;
    String hireDate;
    List<ControlLogByAccountResponse> controlLogByAccountResponseList;
}
