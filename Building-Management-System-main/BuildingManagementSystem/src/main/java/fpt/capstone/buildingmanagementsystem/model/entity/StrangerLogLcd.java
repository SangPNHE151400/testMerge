package fpt.capstone.buildingmanagementsystem.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@ToString
@Builder
public class StrangerLogLcd {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String strangerLogId;

    private int snapId;

    private String direction;

    private Date time;

    private double temperature;

    private double temperatureAlarm;

    @Lob
    @Column(length = 65555)
    private byte[] image;

    @ManyToOne
    @JoinColumn(name = "deviceId")
    private Device device;

    @ManyToOne
    @JoinColumn(name = "roomId")
    private Room room;
}
