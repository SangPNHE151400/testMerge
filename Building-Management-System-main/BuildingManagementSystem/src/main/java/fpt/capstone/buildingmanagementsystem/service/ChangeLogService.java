package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.model.entity.ChangeLog;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeLogRequest;
import fpt.capstone.buildingmanagementsystem.model.response.ChangeLogResponse;
import fpt.capstone.buildingmanagementsystem.repository.ChangeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChangeLogService {

    @Autowired
    ChangeLogRepository changeLogRepository;

    public List<ChangeLogResponse> getAllChangeLogByEmployeeIdAndMonth(ChangeLogRequest changeLogRequest) {
        List<ChangeLog> changeLogs = changeLogRepository.getChangeLogByUserIdAndMonth(changeLogRequest.getEmployeeId(), changeLogRequest.getMonth());

        return changeLogs.stream()
                .map(changeLog -> new ChangeLogResponse(
                        changeLog.getChangeLogId(),
                        changeLog.getCheckin(),
                        changeLog.getCheckout(),
                        changeLog.getOutsideWork(),
                        changeLog.isViolate(),
                        changeLog.getReason(),
                        changeLog.getChangeType(),
                        changeLog.getDate(),
                        changeLog.getCreatedDate(),
                        changeLog.getManager().getUserId(),
                        changeLog.getEmployee().getUserId(),
                        changeLog.getEmployee().getAccount().getUsername(),
                        changeLog.getEmployee().getFirstName(),
                        changeLog.getEmployee().getLastName()
                ))
                .collect(Collectors.toList());
    }

    public List<ChangeLogResponse> getAllLogsInDay(ChangeLogRequest changeLogRequest) {
        List<ChangeLog> changeLogs = changeLogRepository.getChangeLogByUserIdAndDate(changeLogRequest.getEmployeeId(), changeLogRequest.getDate());
        return changeLogs.stream()
                .map(changeLog -> new ChangeLogResponse(
                        changeLog.getChangeLogId(),
                        changeLog.getCheckin(),
                        changeLog.getCheckout(),
                        changeLog.getOutsideWork(),
                        changeLog.isViolate(),
                        changeLog.getReason(),
                        changeLog.getChangeType(),
                        changeLog.getDate(),
                        changeLog.getCreatedDate(),
                        changeLog.getManager().getUserId(),
                        changeLog.getEmployee().getUserId(),
                        changeLog.getEmployee().getAccount().getUsername(),
                        changeLog.getEmployee().getFirstName(),
                        changeLog.getEmployee().getLastName()
                ))
                .collect(Collectors.toList());
    }
}
