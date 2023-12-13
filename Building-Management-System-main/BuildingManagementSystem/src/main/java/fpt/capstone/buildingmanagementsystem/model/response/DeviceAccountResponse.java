package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DeviceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class DeviceAccountResponse {
    private String deviceId;

    private String deviceName;

    private String deviceLcdId;

    private Date createdDate;

    private DeviceStatus status;

    private List<RoomResponse> rooms;

    private List<AccountLcdResponse> accountLcdResponses;
}
