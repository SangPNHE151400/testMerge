package fpt.capstone.buildingmanagementsystem.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ControlLogStatus;
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
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@ToString
public class ControlLogLcd {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String controlLogId;

    @Column
    @JsonProperty("operator")
    private String operator;

    @Column
    @JsonProperty("personId")
    private String personId;

    @Column
    @JsonProperty("personType")
    @Enumerated(EnumType.STRING)
    private ControlLogStatus status;

    @Column
    @JsonProperty("RecordID")
    private int recordId;

    @Column
    @JsonProperty("verifyStatus")
    private int verifyStatus;

    @Column
    @JsonProperty("similarity1")
    private double similarity1;

    @Column
    @JsonProperty("similarity2")
    private double similarity2;

    @Column
    @JsonProperty("persionName")
    private String persionName;

    @Column
    @JsonProperty("telnum")
    private String telnum;

    @Column
    @JsonProperty("time")
    private Date time;

    @Column
    private double temperature;

    @Column
    private double temperatureAlarm;

    @Lob
    @Column
    @JsonProperty("pic")
    private byte[] pic;

    @ManyToOne
    @JoinColumn(name = "accountId")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "deviceId")
    private Device device;

    @ManyToOne
    @JoinColumn(name = "roomId")
    private Room room;
}
