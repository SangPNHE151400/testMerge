package fpt.capstone.buildingmanagementsystem.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Getter
@Setter
@Table(name = "chat_message")
public class ChatMessage {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "messageId")
    private String id;
    @Column(name = "message")
    private String message;
    @Column
    private String fileName;
    @Column
    private String imageName;
    @Column
    private byte[] file;
    @Column
    private String fileType;
    @Column(name = "createAt")
    private Date createAt;
    @Column(name = "updateAt")
    private Date updateAt;
    @Column(name = "type")
    private String type;
    @ManyToOne
    @JoinColumn(name = "senderId")
    private User sender;
    @ManyToOne
    @JoinColumn(name = "chatId")
    private Chat chat;
}
