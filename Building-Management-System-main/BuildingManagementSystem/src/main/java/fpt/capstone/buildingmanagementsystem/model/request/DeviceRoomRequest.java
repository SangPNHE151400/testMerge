package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DeviceRoomRequest {
    private String deviceId;

    private String newRoomId;

    private String deviceName;

    private String deviceLcdId;

    private String deviceUrl;
}
