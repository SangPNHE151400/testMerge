package fpt.capstone.buildingmanagementsystem.model.request;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ControlLogStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ChangeStatusRequest {
    String accountId;
    ControlLogStatus status;
}
