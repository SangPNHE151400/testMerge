package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.Conflict;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.mapper.ChangeLogMapper;
import fpt.capstone.buildingmanagementsystem.model.dto.DailyLogDto;
import fpt.capstone.buildingmanagementsystem.model.entity.ChangeLog;
import fpt.capstone.buildingmanagementsystem.model.entity.ControlLogLcd;
import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.WorkingOutsideType;
import fpt.capstone.buildingmanagementsystem.model.request.SaveChangeLogRequest;
import fpt.capstone.buildingmanagementsystem.model.response.ChangeLogDetailResponse;
import fpt.capstone.buildingmanagementsystem.model.response.ControlLogResponse;
import fpt.capstone.buildingmanagementsystem.repository.ChangeLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.ControlLogLcdRepository;
import fpt.capstone.buildingmanagementsystem.repository.DailyLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import static fpt.capstone.buildingmanagementsystem.validate.Validate.compareTime;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.validateStartTimeAndEndTime;

@Service
public class RequestChangeLogService {
    @Autowired
    ControlLogLcdRepository controlLogLcdRepository;
    @Autowired
    DailyLogRepository dailyLogRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ChangeLogRepository changeLogRepository;
    @Autowired
    ChangeLogMapper changeLogMapper;

    @Autowired
    DailyLogService dailyLogService;

    private static final Time startMorningTime = Time.valueOf("08:30:00");

    private static final Time endMorningTime = Time.valueOf("12:00:00");

    private static final Time startAfternoonTime = Time.valueOf("13:00:00");

    private static final Time endAfternoonTime = Time.valueOf("17:30:00");

    public void saveChangeLog(SaveChangeLogRequest saveChangeLogRequest) {
        try {
            if (saveChangeLogRequest.getManagerId() != null &&
                    saveChangeLogRequest.getEmployeeId() != null &&
                    saveChangeLogRequest.getDate() != null &&
                    saveChangeLogRequest.getChangeType() != null
            ) {
                ChangeLog changeLog = changeLogMapper.convert(saveChangeLogRequest);
                if (saveChangeLogRequest.getManualCheckIn() != null && saveChangeLogRequest.getManualCheckOut() != null
                        && validateStartTimeAndEndTime(saveChangeLogRequest.getManualCheckIn(), saveChangeLogRequest.getManualCheckOut())
                        || saveChangeLogRequest.getManualCheckIn() == null && saveChangeLogRequest.getManualCheckOut() == null
                        || saveChangeLogRequest.getManualCheckIn() != null && saveChangeLogRequest.getManualCheckOut() == null
                        || saveChangeLogRequest.getManualCheckIn() == null
                ) {
                    Optional<User> userEmp = userRepository.findByUserId(saveChangeLogRequest.getEmployeeId());
                    Optional<User> userManager = userRepository.findByUserId(saveChangeLogRequest.getManagerId());
                    if (userEmp.isPresent() && userManager.isPresent()) {
                        if (saveChangeLogRequest.getWorkOutSide() == null) {
                            changeLog.setOutsideWork(-1);
                        } else {
                            changeLog.setOutsideWork(Double.parseDouble(saveChangeLogRequest.getWorkOutSide()));
                        }
                        changeLog.setEmployee(userEmp.get());
                        changeLog.setManager(userManager.get());
                        changeLogRepository.save(changeLog);
                    } else {
                        throw new BadRequest("request_fail");
                    }
                } else {
                    throw new Conflict("checkout_time_need_to_be_larger_checkin");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError | ParseException e) {
            throw new ServerError("fail");
        }
    }

    public ResponseEntity<?> updateDailyLogFromChange(SaveChangeLogRequest changeLogRequest) {
        try {
            User employee = userRepository.findByUserId(changeLogRequest.getEmployeeId())
                    .orElseThrow(() -> new BadRequest("not_found_employee"));
            Date requestDate = Until.convertStringToDate(changeLogRequest.getDate());
            DailyLog dailyLog = dailyLogRepository.findByUserAndDate(employee, requestDate)
                    .orElseThrow(() -> new BadRequest("Not_found_daily_log"));
            //attendance
            if (changeLogRequest.getManualCheckIn() != null && changeLogRequest.getManualCheckOut() == null) {
                Time checkin = Until.convertStringToTime(changeLogRequest.getManualCheckIn());
                if (compareTime(checkin, dailyLog.getCheckout()) > 0) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(changeLogRequest);
                }

                dailyLog.setCheckin(checkin);
            }
            if (changeLogRequest.getManualCheckOut() != null && changeLogRequest.getManualCheckIn() == null) {
                Time checkout = Until.convertStringToTime(changeLogRequest.getManualCheckOut());
                if (compareTime(checkout, dailyLog.getCheckin()) < 0) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(changeLogRequest);
                }
                dailyLog.setCheckout(checkout);
            }
            if (changeLogRequest.getManualCheckIn() != null && changeLogRequest.getManualCheckOut() != null) {
                Time checkin = Until.convertStringToTime(changeLogRequest.getManualCheckIn());
                Time checkout = Until.convertStringToTime(changeLogRequest.getManualCheckOut());
                if (compareTime(checkin, checkout) > 0) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(changeLogRequest);
                }
                dailyLog.setCheckin(checkin);
                dailyLog.setCheckout(checkout);
            }

            //working outside
            if (changeLogRequest.getWorkOutSide() != null) {
                Time checkin = null;
                Time checkout = null;
                double workingOutside = Double.parseDouble(changeLogRequest.getWorkOutSide());
                if (workingOutside == 0) {
                    //update khong co working outside
                    dailyLog.setCheckin(dailyLog.getSystemCheckIn());
                    dailyLog.setCheckout(dailyLog.getSystemCheckOut());
                } else if (workingOutside == 1 || workingOutside == 0.5) {
                    if (changeLogRequest.getType().equals(WorkingOutsideType.HALF_MORNING.toString())) {
                        checkin = startMorningTime;
                        if (compareTime(dailyLog.getCheckout(), endMorningTime) < 0 || dailyLog.getCheckout() == null) {
                            checkout = endMorningTime;
                        }
                    }
                    if (changeLogRequest.getType().equals(WorkingOutsideType.HALF_AFTERNOON.toString())) {
                        checkout = endAfternoonTime;
                        if (compareTime(dailyLog.getCheckin(), startAfternoonTime) > 0 || dailyLog.getCheckin() == null) {
                            checkin = startAfternoonTime;
                        }
                    }
                    if (changeLogRequest.getType().equals(WorkingOutsideType.ALL_DAY.toString())) {
                        checkin = startMorningTime;
                        checkout = endAfternoonTime;
                    }
                    if (checkin != null) {
                        if (compareTime(dailyLog.getCheckin(), checkin) > 0 || dailyLog.getCheckin() == null) {
                            dailyLog.setCheckin(checkin);
                        }
                    }

                    if (checkout != null) {
                        if (compareTime(dailyLog.getCheckout(), checkout) < 0 || dailyLog.getCheckout() == null) {
                            dailyLog.setCheckout(checkout);
                        }
                    }
                }
            }
            dailyLogService.updateDailyLog(employee, requestDate, dailyLog.getCheckin(), dailyLog.getCheckout());
            //violate
            if (changeLogRequest.isViolate()) {
                dailyLog.setViolate(!dailyLog.isViolate());
            }

            DailyLog dailyLogChanged = dailyLogRepository.saveAndFlush(dailyLog);
            DailyLogDto dailyLogDto = new DailyLogDto();
            BeanUtils.copyProperties(dailyLogChanged, dailyLogDto);

            saveChangeLog(changeLogRequest);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(dailyLogDto);

        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    public ChangeLogDetailResponse getChangeLogDetail(String change_log_id, String employee_id, String date) {
        if (employee_id != null && Validate.validateDateFormat(date)) {
            try {
                Optional<DailyLog> dailyLogOptional = dailyLogRepository.getAttendanceDetailByUserIdAndDate(employee_id, date);
                if (dailyLogOptional.isPresent()) {
                    DailyLog dailyLogs = dailyLogOptional.get();
                    String name = dailyLogs.getUser().getFirstName() + " " + dailyLogs.getUser().getLastName();
                    String username = dailyLogs.getUser().getAccount().getUsername();
                    List<ControlLogLcd> controlLogLcds = controlLogLcdRepository.getControlLogLcdList(username, date);
                    controlLogLcds = controlLogLcds.stream()
                            .sorted((Comparator.comparing(ControlLogLcd::getTime)))
                            .collect(Collectors.toList());
                    String departmentName = dailyLogs.getUser().getDepartment().getDepartmentName();
                    SimpleDateFormat sdf = new SimpleDateFormat("EEEE, MMMM dd, yyyy", Locale.US);
                    String dateDaily = sdf.format(Until.convertDateToCalender(dailyLogs.getDate()).getTime());
                    Time checkin = dailyLogs.getCheckin();
                    Time checkout = dailyLogs.getCheckout();
                    Optional<ChangeLog> changeLog = changeLogRepository.findChangeLogByChangeLogId(change_log_id);
                    Time checkinChange = null;
                    Time checkoutChange = null;
                    String dateDailyChange = null;
                    String changeFrom = null;
                    boolean violate = false;
                    double outSideWork = 0;
                    String reason = null;
                    if (changeLog.isPresent()) {
                        checkinChange = changeLog.get().getCheckin();
                        checkoutChange = changeLog.get().getCheckout();
                        dateDailyChange = sdf.format(Until.convertDateToCalender(changeLog.get().getCreatedDate()).getTime());
                        changeFrom = changeLog.get().getChangeType().toString();
                        violate = changeLog.get().isViolate();
                        outSideWork = changeLog.get().getOutsideWork();
                        reason = changeLog.get().getReason();
                    }
                    List<ControlLogResponse> controlLogResponse = new ArrayList<>();
                    controlLogLcds.forEach(element -> {
                        ControlLogResponse controlLogResponse1 = new ControlLogResponse();
                        controlLogResponse1.setLog(element.getTime().toString());
                        controlLogResponse1.setUsername(username);
                        controlLogResponse.add(controlLogResponse1);
                    });
                    return ChangeLogDetailResponse.builder()
                            .name(name).username(username).departmentName(departmentName).dateDaily(dateDaily)
                            .checkin(checkin).checkout(checkout).checkinChange(checkinChange).checkoutChange(checkoutChange).dateDailyChange(dateDailyChange)
                            .violate(violate).changeFrom(changeFrom).outSideWork(outSideWork).reason(reason)
                            .controlLogResponse(controlLogResponse)
                            .build();
                } else {
                    throw new NotFound("request_fail");
                }
            } catch (ServerError | ParseException e) {
                throw new ServerError("fail");
            }
        } else {
            throw new BadRequest("request_fail");
        }
    }
}
