package fpt.capstone.buildingmanagementsystem.model.entity;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
public class RequestMessage {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String requestMessageId;

    @Column
    private Date createDate;

    @Column
    private Date updateDate;
    @Column
    private String attachmentMessageId;

    @ManyToOne
    @JoinColumn(name = "senderId")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiverId")
    private User receiver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requestId")
    private RequestTicket request;

    @ManyToOne
    @JoinColumn(name = "departmentId")
    private Department department;

}
