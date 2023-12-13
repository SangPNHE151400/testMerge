package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.HolidayDeleteRequest;
import fpt.capstone.buildingmanagementsystem.model.request.HolidaySaveRequest;
import fpt.capstone.buildingmanagementsystem.model.request.UserRequest;
import fpt.capstone.buildingmanagementsystem.model.response.HolidayResponse;
import fpt.capstone.buildingmanagementsystem.service.HolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RestController
@CrossOrigin
public class HolidayController {
    @Autowired
    HolidayService holidayService;

    @PostMapping("saveHoliday")
    public boolean saveHoliday(@RequestBody HolidaySaveRequest holidaySaveRequest) throws ParseException {
        return holidayService.saveHoliday(holidaySaveRequest);
    }

    @PostMapping("deleteHoliday")
    public boolean deleteHoliday(@RequestBody HolidayDeleteRequest holidayDeleteRequest) {
        return holidayService.deleteHoliday(holidayDeleteRequest);
    }

    @GetMapping("/listAllHoliday")
    public List<HolidayResponse> listAllHoliday() {
        return holidayService.listAllHoliday();
    }

    @PostMapping("/validateHolidayEmail")
    public boolean validateHolidayEmail(@RequestBody UserRequest request) {
        return holidayService.sendHolidayEmail(request.getUserName());
    }

    @GetMapping("/checkHolidayCode")
    public boolean checkHolidayCode(@RequestParam("code") String code, @RequestParam("user_id")String userId) {
        return holidayService.checkHolidayCode(code, userId);
    }
}
