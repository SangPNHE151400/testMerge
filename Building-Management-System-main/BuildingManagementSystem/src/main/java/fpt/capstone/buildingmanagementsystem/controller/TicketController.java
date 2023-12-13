package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.ChangeReceiveIdRequest;
import fpt.capstone.buildingmanagementsystem.model.response.TicketRequestResponse;
import fpt.capstone.buildingmanagementsystem.model.response.TicketRequestResponseV2;
import fpt.capstone.buildingmanagementsystem.service.TicketManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class TicketController {

    @Autowired
    private TicketManageService ticketManageService;

    @GetMapping("/ticketRequest")
    @Deprecated
    public List<TicketRequestResponse> getAllTicketAndRequest() {
        return ticketManageService.getAllTickets();
    }

    @GetMapping("/getTicketByUser")
    public List<TicketRequestResponseV2> getAllTicketAndRequest(@RequestParam("sender_id") String senderId) {
        return ticketManageService.getAllTicketsBySenderId(senderId);
    }

    @GetMapping("/getTicketHr")
    public List<TicketRequestResponseV2> getAllTicketAndRequestByHr() {
        return ticketManageService.getAllTicketsByHr();
    }

    @GetMapping("/getTicketSecurity")
    public List<TicketRequestResponseV2> getAllTicketAndRequestBySecurity() {
        return ticketManageService.getAllTicketsBySecurity();
    }

    @GetMapping("/getTicketAdmin")
    public List<TicketRequestResponseV2> getAllTicketAndRequestByAdmin() {
        return ticketManageService.getAllTicketsByAdmin();
    }

    @GetMapping("/getTicketDepartment")
    public List<TicketRequestResponseV2> getAllTicketAndRequestByDepartmentManager(@RequestParam("department") String departmentName) {
        return ticketManageService.getAllTicketByDepartmentManager(departmentName);
    }

    @PostMapping("/changeReceiveId")
    public boolean changeReceiveIdRequest(@RequestBody ChangeReceiveIdRequest changeReceiveIdRequest) {
        return ticketManageService.changeReceiveId(changeReceiveIdRequest);
    }
}
