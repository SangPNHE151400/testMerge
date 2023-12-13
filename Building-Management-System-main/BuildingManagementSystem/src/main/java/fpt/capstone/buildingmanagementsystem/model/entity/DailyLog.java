package fpt.capstone.buildingmanagementsystem.model.entity;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.sql.Date;
import java.sql.Time;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity(name = "daily_log")
public class DailyLog {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String dailyId;

    @Column(name = "date")
    private Date date;
    @Column(name = "month")
    private int month;
    @Column
    private Time checkin;

    @Column
    private Time checkout;

    @Column
    private double totalAttendance;

    @Column
    private double morningTotal;

    @Column
    private double afternoonTotal;

    @Column
    private boolean lateCheckin;

    @Column
    private boolean earlyCheckout;

    @Column
    private double permittedLeave;

    @Column
    private double nonPermittedLeave;

    @Column
    private boolean Violate;

    @Column
    private double outsideWork;

    @Column
    private double paidDay;

    @Column
    private Time systemCheckIn;

    @Column
    private Time systemCheckOut;

    @Column(name = "date_type")
    @Enumerated(EnumType.STRING)
    private DateType dateType;

    @Column
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @Override
    public String toString() {
        return "DailyLog{" +
                "dailyId='" + dailyId + '\'' +
                ", date=" + date +
                ", checkin=" + checkin +
                ", checkout=" + checkout +
                ", totalAttendance=" + totalAttendance +
                ", morningTotal=" + morningTotal +
                ", afternoonTotal=" + afternoonTotal +
                ", lateCheckin=" + lateCheckin +
                ", earlyCheckout=" + earlyCheckout +
                ", permittedLeave=" + permittedLeave +
                ", nonPermittedLeave=" + nonPermittedLeave +
                ", Violate=" + Violate +
                ", outsideWork=" + outsideWork +
                ", paidDay=" + paidDay +
                ", dateType=" + dateType +
                ", description='" + description + '\'' +
                '}';
    }
}
