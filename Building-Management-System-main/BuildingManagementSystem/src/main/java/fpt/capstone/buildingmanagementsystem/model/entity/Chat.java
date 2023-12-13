package fpt.capstone.buildingmanagementsystem.model.entity;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Getter
@Setter
@Table(name = "chat")
public class Chat {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "chatId")
    private String id;
    @Column(name = "chatName")
    private String chatName;
    @Column(name = "isGroupChat")
    private boolean isGroupChat;
    @Column(name = "createAt")
    private Date createAt;
    @Column(name="createdBy")
    private String createdBy;
    @Column(name = "updateAt")
    private Date updateAt;
}
