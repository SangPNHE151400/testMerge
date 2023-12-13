package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.ChangeLogRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SaveChangeLogRequest;
import fpt.capstone.buildingmanagementsystem.model.response.ChangeLogDetailResponse;
import fpt.capstone.buildingmanagementsystem.model.response.ChangeLogResponse;
import fpt.capstone.buildingmanagementsystem.model.response.FilePdfResponse;
import fpt.capstone.buildingmanagementsystem.service.ChangeLogReportDetailPDFService;
import fpt.capstone.buildingmanagementsystem.service.ChangeLogService;
import fpt.capstone.buildingmanagementsystem.service.RequestChangeLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
public class ChangeLogController {
    @Autowired
    RequestChangeLogService requestChangeLogService;

    @Autowired
    ChangeLogReportDetailPDFService changeLogReportDetailPDFService;
    @Autowired
    ChangeLogService changeLogService;

    @PostMapping("/saveChangeLog")
    public ResponseEntity<?> saveChangeLog(@RequestBody SaveChangeLogRequest saveChangeLogRequest) {
        return requestChangeLogService.updateDailyLogFromChange(saveChangeLogRequest);
    }

    @PostMapping("getChangeLogByEmployeeAndMonth")
    public List<ChangeLogResponse> getChangeLogByEmployeeAndMonth(@RequestBody ChangeLogRequest changeLogRequest) {
        return changeLogService.getAllChangeLogByEmployeeIdAndMonth(changeLogRequest);
    }

    @PostMapping("getChangeLogsInDay")
    public List<ChangeLogResponse> getChangeLogsInDay(@RequestBody ChangeLogRequest changeLogRequest) {
        return changeLogService.getAllLogsInDay(changeLogRequest);
    }

    @GetMapping("/getChangeLogDetail")
    public ChangeLogDetailResponse getChangeLogDetail(@Param("change_log_id") String change_log_id,@Param("employee_id") String employee_id, @Param("date") String date) {
        return requestChangeLogService.getChangeLogDetail(change_log_id,employee_id, date);
    }
    @GetMapping("/exportChangeLogReportDetail")
    public FilePdfResponse exportChangeLogReportDetail(@Param("change_log_id") String change_log_id, @Param("employee_id") String employee_id, @Param("date") String date) throws IOException {
        return changeLogReportDetailPDFService.export(change_log_id,employee_id, date);
    }
}
