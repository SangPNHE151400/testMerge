package fpt.capstone.buildingmanagementsystem.model.dto;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ChangeLogType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DailyLogDto {
    private String changeLogId;
    private Date date;
    private Time checkin;
    private Time checkout;
    private double outsideWork;
    private boolean violate;
    private String reason;
    private ChangeLogType changeType;
    private java.util.Date createdDate;
}
