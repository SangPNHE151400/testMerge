package fpt.capstone.buildingmanagementsystem.model.entity;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Builder
public class Ticket {
    @Id
    private String ticketId;

    @Column
    private Date createDate;

    @Column
    private Date updateDate;

    @Column
    private boolean status;

    @Enumerated(EnumType.STRING)
    private TopicEnum topic;
}
