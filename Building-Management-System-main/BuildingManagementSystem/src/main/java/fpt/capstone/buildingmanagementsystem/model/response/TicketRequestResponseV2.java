package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class TicketRequestResponseV2 {
    private String ticketId;
    String topic;
    private Date createDate;
    private Date updateDate;
    private boolean status;
    List<RequestTicketResponse> requestTickets;
}
