package fpt.capstone.buildingmanagementsystem.model.request;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    public String username;
    public String password;
    public String role;
    public String departmentName;
    public String hrId;
    public String roomId;
}
