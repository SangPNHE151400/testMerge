package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DeviceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DeviceRoomResponse {
    private int roomId;

    private String roomName;

    private String deviceId;

    private String lcdId;

    private String deviceName;

    private DeviceStatus status;

    private String deviceUrl;

    private String deviceNote;

    private Date updateDate;
}
