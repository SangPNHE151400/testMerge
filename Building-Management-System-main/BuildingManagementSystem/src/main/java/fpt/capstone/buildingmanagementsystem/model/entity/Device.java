package fpt.capstone.buildingmanagementsystem.model.entity;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DeviceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@ToString
public class Device {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "deviceId")
    private String id;

    @Column(name = "device_lcd_id")
    private String deviceId;

    @Column
    private String deviceName;

    @Column
    @Enumerated(EnumType.STRING)
    private DeviceStatus status = DeviceStatus.ACTIVE;

    @Column
    private String deviceUrl;

    @Column
    private String deviceNote;

    @Column
    private Date createdDate;

    @Column
    private Date updateDate;
}
