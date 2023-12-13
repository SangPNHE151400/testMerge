package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.mapper.OvertimeLogMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.OvertimeLog;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DateType;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicOvertime;
import fpt.capstone.buildingmanagementsystem.model.response.GetOvertimeListResponse;
import fpt.capstone.buildingmanagementsystem.model.response.OverTimeLogResponse;
import fpt.capstone.buildingmanagementsystem.model.response.SystemTimeResponse;
import fpt.capstone.buildingmanagementsystem.repository.DailyLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.OverTimeRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OvertimeService {
    @Autowired
    OvertimeLogMapper overtimeLogMapper;
    @Autowired
    OverTimeRepository overTimeRepository;

    @Autowired
    DailyLogRepository dailyLogRepository;

    @Autowired
    DailyLogService dailyLogService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AttendanceService attendanceService;
    private static final Time startOverTime = Time.valueOf("18:00:00");


    public GetOvertimeListResponse getOvertime(String user_id, String month, String year) {
        try {
            List<OverTimeLogResponse> list = new ArrayList<>();
            if (user_id != null) {
                List<OvertimeLog> overtimeLog1 = overTimeRepository.getOvertimeLog(user_id, month, year);
                overtimeLog1 = overtimeLog1.stream()
                        .sorted((Comparator.comparing(OvertimeLog::getDate).reversed()))
                        .collect(Collectors.toList());
                if (overtimeLog1.size() > 0) {
                    overtimeLog1.forEach(element -> {
                        OverTimeLogResponse overtimeLog;
                        DateType dateType;
                        java.sql.Date sqlDate = java.sql.Date.valueOf(element.getDate().toString());
                        java.util.Date utilDate = new java.util.Date(sqlDate.getTime());
                        SimpleDateFormat sdf = new SimpleDateFormat("EEEE, MMMM dd, yyyy", Locale.US);
                        if (element.getDateType() == TopicOvertime.WEEKEND_AND_NORMAL_DAY) {
                            if ((attendanceService.getCheckWeekend(utilDate) != Calendar.SATURDAY)
                                    && (attendanceService.getCheckWeekend(utilDate) != Calendar.SUNDAY)) {
                                dateType = DateType.NORMAL;
                            } else {
                                dateType = DateType.WEEKEND;
                            }
                        } else {
                            dateType = DateType.HOLIDAY;
                        }
                        try {
                            overtimeLog = OverTimeLogResponse.builder().systemCheckIn(element.getStartTime())
                                    .systemCheckOut(element.getEndTime()).checkin(element.getManualStart()).checkout(element.getManualEnd()).dateType(dateType)
                                    .date(sdf.format(Until.convertDateToCalender(element.getDate()).getTime()))
                                    .totalAttendance(getTime(element.getManualStart(), element.getManualEnd()))
                                    .totalPaid(element.getTotalPaid()).approveDate(element.getApprovedDate()).build();
                        } catch (ParseException e) {
                            throw new ServerError("fail");
                        }
                        list.add(overtimeLog);
                    });
                    SimpleDateFormat sdf = new SimpleDateFormat("MMMM,yyyy", Locale.US);
                    String monthTotal = sdf.format(Until.convertDateToCalender(overtimeLog1.get(0).getDate()).getTime());
                    return new GetOvertimeListResponse(overtimeLog1.get(0).getUser().getAccount().getUsername(), overtimeLog1.get(0).getUser().getDepartment().getDepartmentName(), monthTotal, list);
                } else {
                    throw new NotFound("list_null");
                }
            } else {
                throw new NotFound("user_id_null");
            }
        } catch (ServerError | ParseException e) {
            throw new ServerError("fail");
        }
    }

    public double getTime(Time time1, Time time2) {
        LocalTime timeConvert1 = LocalTime.parse(time1.toString());
        LocalTime timeConvert2 = LocalTime.parse(time2.toString());
        Duration duration = Duration.between(timeConvert1, timeConvert2);
        long totalSeconds = duration.getSeconds();
        String roundedValue = String.format("%.2f", (double) totalSeconds / 3600);
        return Double.parseDouble(roundedValue);
    }

    public SystemTimeResponse getSystemTime(String userId, Date date) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequest("Not_found_user"));

        Optional<DailyLog> dailyLogOptional = dailyLogRepository.findByUserAndDate(user, date);
        if (!dailyLogOptional.isPresent()) return new SystemTimeResponse();
        else {
            DailyLog dailyLog = dailyLogOptional.get();
            DateType dateType = dailyLogService.getDateType(date);
            if (dateType.equals(DateType.NORMAL)) {
                if (Validate.compareTime(dailyLog.getCheckin(), startOverTime) < 0
                        && Validate.compareTime(dailyLog.getCheckout(), startOverTime) > 0) {
                    return new SystemTimeResponse(date, startOverTime, dailyLog.getCheckout());

                } else if (Validate.compareTime(dailyLog.getCheckin(), startOverTime) > 0
                        && Validate.compareTime(dailyLog.getCheckout(), dailyLog.getCheckin()) > 0) {
                    return new SystemTimeResponse(date, dailyLog.getCheckin(), dailyLog.getCheckout());

                } else {
                    return new SystemTimeResponse(date, null, null);
                }
            } else {
                return new SystemTimeResponse(date, dailyLog.getCheckin(), dailyLog.getCheckout());
            }
        }
    }

    public void updateDailyLog(Time otStart, User user, Date date) {
        DailyLog dailyLog = dailyLogRepository.findByUserAndDate(user, date)
                .orElseThrow(() -> new BadRequest("Not_found_log"));

        if (!dailyLog.getDateType().equals(DateType.NORMAL)) return;

        if (Validate.compareTime(dailyLog.getCheckin(), startOverTime) < 0
                && Validate.compareTime(dailyLog.getCheckout(), startOverTime) > 0) {
            dailyLog.setCheckout(otStart);
            dailyLogService.updateDailyLog(user, date, dailyLog.getCheckin(), dailyLog.getCheckout());
        } else if (Validate.compareTime(dailyLog.getCheckin(), startOverTime) > 0
                && Validate.compareTime(dailyLog.getCheckout(), dailyLog.getCheckin()) > 0) {
            dailyLog.setCheckin(null);
            dailyLog.setCheckout(null);
            dailyLogService.updateDailyLog(user, date, dailyLog.getCheckin(), dailyLog.getCheckout());
        }
    }
}
