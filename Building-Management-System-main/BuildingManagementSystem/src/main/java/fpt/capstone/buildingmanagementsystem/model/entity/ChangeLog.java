package fpt.capstone.buildingmanagementsystem.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ChangeLogType;
import lombok.AllArgsConstructor;
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
@Entity
public class ChangeLog {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String changeLogId;

    @Column
    private Date date;
    @Column
    private Time checkin;

    @Column
    private Time checkout;

    @Column
    private double outsideWork;

    @Column
    private boolean violate;

    @Column
    private String reason;

    @Column
    @Enumerated(EnumType.STRING)
    private ChangeLogType changeType;

    @Column
    private java.util.Date createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "manager_id")
    private User manager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "employee_id")
    private User employee;
}
