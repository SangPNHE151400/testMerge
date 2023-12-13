package fpt.capstone.buildingmanagementsystem.model.request;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ControlLogStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChangeRecordStatusRequest {
    String deviceAccountId;
    ControlLogStatus status;
}
