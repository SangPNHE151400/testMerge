package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeRoleRequest {
    public String accountId;
    public String roleName;
    public String departmentId;
    public String roomId;
}
