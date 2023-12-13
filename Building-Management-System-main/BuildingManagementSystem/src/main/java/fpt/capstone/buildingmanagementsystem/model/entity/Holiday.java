package fpt.capstone.buildingmanagementsystem.model.entity;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity(name = "holiday")
public class Holiday {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String holidayId;

    @Column
    private String title;

    @Column
    private String content;

    @Column
    private Date fromDate;

    @Column
    private Date toDate;

    @Column
    private java.util.Date createDate;

    @Column
    private java.util.Date updateDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
