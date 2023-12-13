package fpt.capstone.buildingmanagementsystem.model.request;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DeviceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DeviceStatusRequest {
    private String id;
    private DeviceStatus status;
    private String deviceNote;
}
