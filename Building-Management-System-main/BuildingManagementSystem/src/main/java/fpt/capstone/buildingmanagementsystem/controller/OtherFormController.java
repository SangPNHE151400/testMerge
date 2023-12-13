package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.OtherFormRequest;
import fpt.capstone.buildingmanagementsystem.service.RequestOtherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class OtherFormController {
    @Autowired
    private RequestOtherService requestOtherService;

    @PostMapping("closeOtherRequest")
    public boolean acceptOtherRequest(@RequestBody OtherFormRequest otherFormRequest) {
        return requestOtherService.closeOtherRequest(otherFormRequest.getTicketId());
    }
}
