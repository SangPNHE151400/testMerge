package fpt.capstone.buildingmanagementsystem.model.entity;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus;
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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
public class RequestTicket {
    @Id
    @Column(name = "requestId", updatable = false, nullable = false)
    private String requestId;

    @Column
    private String title;

    @Column
    private Date createDate;

    @Column
    private Date updateDate;

    @Column
    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @ManyToOne
    @JoinColumn(name = "ticketId")
    private Ticket ticketRequest;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

}
