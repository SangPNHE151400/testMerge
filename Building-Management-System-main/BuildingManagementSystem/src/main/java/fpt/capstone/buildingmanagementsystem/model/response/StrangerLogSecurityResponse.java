package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class StrangerLogSecurityResponse {
    private String strangerLogId;
    private int snapId;
    private String deviceName;
    private String deviceId;
    private String room;
    private String time;
    private double temperature;
    private byte[] image;
}
