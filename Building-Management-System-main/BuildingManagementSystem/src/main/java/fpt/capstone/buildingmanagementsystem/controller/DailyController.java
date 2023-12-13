package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.entity.DayOff;
import fpt.capstone.buildingmanagementsystem.service.DailyLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class DailyController {

    @Autowired
    private DailyLogService dailyLogService;

    @GetMapping("initDayOff")
    public List<DayOff> initDayOff() {
        return dailyLogService.initEmployeeDayOff();
    }
}
