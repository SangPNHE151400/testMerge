package fpt.capstone.buildingmanagementsystem.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.EvaluateEnum;
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
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
public class MonthlyEvaluate {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String evaluateId;

    @Column
    private double workingDay;

    @Column
    private double totalAttendance;

    @Column
    private int lateCheckin;

    @Column
    private int earlyCheckout;

    @Column
    private double permittedLeave;

    @Column
    private double nonPermittedLeave;

    @Column
    private int violate;

    @Column
    private double overTime;

    @Column
    private double paidDay;

    @Column
    private int month;

    @Column
    private int year;

    @Column
    private double workingOutside;

    @Column
    @Enumerated(EnumType.STRING)
    private EvaluateEnum evaluateEnum;

    @Column
    private String note;

    @Column
    private Date createdDate;

    @Column
    private Date updateDate;

    @Column
    private Date approvedDate;

    @Column
    private boolean status;

    @Column
    private String HrNote;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "acceptedBy")
    private User acceptedBy;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "createdBy")
    private User createdBy;//

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "employee")
    private User employee;//

    @ManyToOne
    @JoinColumn(name = "department")
    private Department department;
}
