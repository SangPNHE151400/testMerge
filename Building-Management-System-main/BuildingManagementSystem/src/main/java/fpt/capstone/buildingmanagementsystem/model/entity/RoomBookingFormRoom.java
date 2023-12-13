package fpt.capstone.buildingmanagementsystem.model.entity;

import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.RoomBookingRequestForm;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
public class RoomBookingFormRoom {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String RoomBookingFormRoomId;

    @ManyToOne
    @JoinColumn(name = "roomBookingRequestId")
    private RoomBookingRequestForm roomRequestForm;

    @ManyToOne
    @JoinColumn(name = "roomId")
    private Room room;
}
