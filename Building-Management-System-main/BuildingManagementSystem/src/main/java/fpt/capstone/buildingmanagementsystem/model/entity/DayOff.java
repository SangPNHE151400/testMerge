package fpt.capstone.buildingmanagementsystem.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
public class DayOff {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String dayOffId;

    @Column
    private double january;

    @Column
    private double february;

    @Column
    private double april;

    @Column
    private double march;

    @Column
    private double may;

    @Column
    private double june;

    @Column
    private double july;

    @Column
    private double august;

    @Column
    private double september;

    @Column
    private double october;

    @Column
    private double november;

    @Column
    private double december;

    @Column
    private int year;

    @ManyToOne
    @JoinColumn(name = "accountId")
    private Account account;

}
