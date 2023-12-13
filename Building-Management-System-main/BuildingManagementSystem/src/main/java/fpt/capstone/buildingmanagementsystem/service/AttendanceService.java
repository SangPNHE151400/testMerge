package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.mapper.DailyLogMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.ControlLogLcd;
import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LeaveRequestForm;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ChangeLogType;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.LateType;
import fpt.capstone.buildingmanagementsystem.model.request.SaveChangeLogRequest;
import fpt.capstone.buildingmanagementsystem.model.response.AttendanceDetailResponse;
import fpt.capstone.buildingmanagementsystem.model.response.ControlLogResponse;
import fpt.capstone.buildingmanagementsystem.model.response.DailyLogResponse;
import fpt.capstone.buildingmanagementsystem.model.response.GetAttendanceUserResponse;
import fpt.capstone.buildingmanagementsystem.model.response.LateFormResponse;
import fpt.capstone.buildingmanagementsystem.model.response.TotalAttendanceUser;
import fpt.capstone.buildingmanagementsystem.repository.ControlLogLcdRepository;
import fpt.capstone.buildingmanagementsystem.repository.DailyLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.LateRequestFormRepositoryV2;
import fpt.capstone.buildingmanagementsystem.repository.LeaveRequestFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.repository.WorkingOutsideFormRepository;
import fpt.capstone.buildingmanagementsystem.service.schedule.CheckoutAnalyzeSchedule;
import fpt.capstone.buildingmanagementsystem.until.Until;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class AttendanceService {
    @Autowired
    DailyLogRepository dailyLogRepository;
    @Autowired
    DailyLogMapper dailyLogMapper;
    @Autowired
    ControlLogLcdRepository controlLogLcdRepository;

    @Autowired
    CheckoutAnalyzeSchedule checkoutAnalyzeSchedule;

    @Autowired
    DailyLogService dailyLogService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RequestChangeLogService requestChangeLogService;

    @Autowired
    LeaveRequestFormRepository leaveRequestFormRepository;

    @Autowired
    LateRequestFormRepositoryV2 lateRequestFormRepository;

    @Autowired
    WorkingOutsideFormRepository workingOutsideFormRepository;

    SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss");

    public GetAttendanceUserResponse getAttendanceUser(String user_id, int month, String year) {
        try {
            double totalAttendance = 0.0;
            double morningTotal = 0.0;
            double afternoonTotal = 0.0;
            double lateCheckinTotal = 0.0;
            double earlyCheckoutTotal = 0.0;
            double permittedLeave = 0.0;
            double nonPermittedLeave = 0.0;
            double ViolateTotal = 0.0;
            double outsideWork = 0.0;
            double paidDay = 0.0;
            int totalDay = 0;
            List<DailyLogResponse> list = new ArrayList<>();
            if (user_id != null) {
                List<DailyLog> dailyLogs = dailyLogRepository.getByUserIdAndMonthAndYear(user_id, month, year);
                dailyLogs = dailyLogs.stream()
                        .sorted((Comparator.comparing(DailyLog::getDate).reversed()))
                        .collect(Collectors.toList());
                if (dailyLogs.size() > 0) {
                    for (DailyLog dailyLog : dailyLogs) {
                        totalAttendance = totalAttendance + dailyLog.getTotalAttendance();
                        morningTotal = morningTotal + dailyLog.getMorningTotal();
                        afternoonTotal = afternoonTotal + dailyLog.getAfternoonTotal();
                        if (dailyLog.isEarlyCheckout()) {
                            lateCheckinTotal = lateCheckinTotal + 1.0;
                        }
                        if (dailyLog.isEarlyCheckout()) {
                            earlyCheckoutTotal = earlyCheckoutTotal + 1.0;
                        }
                        if (dailyLog.isViolate()) {
                            ViolateTotal = ViolateTotal + 1.0;
                        }
                        if ((getCheckWeekend(dailyLog.getDate()) != Calendar.SATURDAY) && (getCheckWeekend(dailyLog.getDate()) != Calendar.SUNDAY)) {
                            totalDay = totalDay + 1;
                        }
                        permittedLeave = permittedLeave + dailyLog.getPermittedLeave();
                        nonPermittedLeave = nonPermittedLeave + dailyLog.getNonPermittedLeave();
                        outsideWork = outsideWork + dailyLog.getOutsideWork();
                        paidDay = paidDay + dailyLog.getPaidDay();
                        DailyLogResponse dailyLogResponse = dailyLogMapper.convertGetAttendanceUserResponse(dailyLog);
                        SimpleDateFormat sdf = new SimpleDateFormat("EEEE, MMMM dd, yyyy", Locale.US);
                        dailyLogResponse.setDateDaily(sdf.format(Until.convertDateToCalender(dailyLog.getDate()).getTime()));
                        list.add(dailyLogResponse);
                    }
                    SimpleDateFormat sdf = new SimpleDateFormat("MMMM,yyyy", Locale.US);
                    String monthTotal = sdf.format(Until.convertDateToCalender(dailyLogs.get(0).getDate()).getTime());
                    TotalAttendanceUser totalAttendanceUser = TotalAttendanceUser.builder().
                            lateCheckinTotal(lateCheckinTotal).ViolateTotal(ViolateTotal)
                            .earlyCheckoutTotal(earlyCheckoutTotal)
                            .date(monthTotal)
                            .afternoonTotal(afternoonTotal)
                            .morningTotal(morningTotal)
                            .totalAttendance(totalAttendance)
                            .nonPermittedLeave(nonPermittedLeave)
                            .paidDay(paidDay)
                            .permittedLeave(permittedLeave)
                            .outsideWork(outsideWork)
                            .totalDate(totalDay)
                            .build();
                    SimpleDateFormat sdf2 = new SimpleDateFormat("EEEE, MMMM dd, yyyy", Locale.US);
                    return new GetAttendanceUserResponse(dailyLogs.get(0).getUser().getAccount().getUsername()
                            , dailyLogs.get(0).getUser().getDepartment().getDepartmentName(), monthTotal,
                            sdf2.format(Until.convertDateToCalender(dailyLogs.get(0).getUser().getAccount().getCreatedDate()).getTime())
                            , totalAttendanceUser, list);
                } else {
                    throw new NotFound("list_null");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public AttendanceDetailResponse getAttendanceDetail(String user_id, String date) {
        if (user_id != null && Validate.validateDateFormat(date)) {
            try {
                Optional<DailyLog> dailyLogOptional = dailyLogRepository.getAttendanceDetailByUserIdAndDate(user_id, date);
                if (dailyLogOptional.isPresent()) {
                    DailyLog dailyLog = dailyLogOptional.get();
                    String name = dailyLog.getUser().getFirstName() + " " + dailyLog.getUser().getLastName();
                    String username = dailyLog.getUser().getAccount().getUsername();
                    List<ControlLogLcd> controlLogLcds = controlLogLcdRepository.getControlLogLcdList(username, date);
                    controlLogLcds = controlLogLcds.stream()
                            .sorted((Comparator.comparing(ControlLogLcd::getTime)))
                            .collect(Collectors.toList());
                    String departmentName = dailyLog.getUser().getDepartment().getDepartmentName();
                    SimpleDateFormat sdf = new SimpleDateFormat("EEEE, MMMM dd, yyyy", Locale.US);
                    String dateDaily = sdf.format(Until.convertDateToCalender(dailyLog.getDate()).getTime());
                    Time checkin = dailyLog.getCheckin();
                    Time checkout = dailyLog.getCheckout();
                    double totalAttendance = dailyLog.getTotalAttendance();
                    double morningTotal = dailyLog.getMorningTotal();
                    double afternoonTotal = dailyLog.getAfternoonTotal();

                    boolean lateCheckin = false;
                    boolean earlyCheckout = false;
                    boolean leaveWithoutNotice = false;
                    double permittedLeave = dailyLog.getPermittedLeave();
                    double nonPermittedLeave = dailyLog.getNonPermittedLeave();
                    if (dailyLog.isViolate()) {
                        lateCheckin = isViolateLateCheckin(dailyLog);
                        earlyCheckout = isViolateEarlyCheckout(dailyLog);
                        leaveWithoutNotice = isViolateNonPermittedLeave(dailyLog);
                    }

                    double outsideWork = dailyLog.getOutsideWork();
                    List<ControlLogResponse> controlLogResponse = new ArrayList<>();




                    controlLogLcds.forEach(element -> {
                        ControlLogResponse controlLogResponse1 = new ControlLogResponse();
                        controlLogResponse1.setLog(element.getTime().toString());
                        controlLogResponse1.setUsername(username);
                        controlLogResponse.add(controlLogResponse1);
                    });
                    return AttendanceDetailResponse.builder()
                            .name(name).username(username).departmentName(departmentName).dateDaily(dateDaily)
                            .checkin(checkin).checkout(checkout).totalAttendance(totalAttendance)
                            .morningTotal(morningTotal).afternoonTotal(afternoonTotal).lateCheckin(lateCheckin)
                            .earlyCheckout(earlyCheckout).permittedLeave(permittedLeave)
                            .nonPermittedLeave(nonPermittedLeave)
                            .leaveWithoutNotice(leaveWithoutNotice)
                            .outsideWork(outsideWork).controlLogResponse(controlLogResponse)
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

    private boolean isViolateLateCheckin(DailyLog dailyLog) {
        List<LateFormResponse> findLateMorningAccepted = lateRequestFormRepository.findLateAndEarlyViolateByUserIdAndDate(dailyLog.getUser().getUserId(), dailyLog.getDate(), LateType.LATE_MORNING);
        return findLateMorningAccepted.isEmpty();
    }

    private boolean isViolateEarlyCheckout(DailyLog dailyLog) {
        List<LateFormResponse> earlyCheckout = lateRequestFormRepository.findLateAndEarlyViolateByUserIdAndDate(dailyLog.getUser().getUserId(), dailyLog.getDate(), LateType.EARLY_AFTERNOON);
        return earlyCheckout.isEmpty();
    }

    private boolean isViolateNonPermittedLeave(DailyLog dailyLog) {
        if (dailyLog.getNonPermittedLeave() > 0) {
            List<LeaveRequestForm> leaveRequestForms = leaveRequestFormRepository.findRequestByUserIdAndDate(dailyLog.getUser().getUserId(), dailyLog.getDate());
            return leaveRequestForms.isEmpty();
        }
        return false;
    }

    public int getCheckWeekend(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.DAY_OF_WEEK);
    }

    @Transactional
    public void updateAttendanceTime(java.sql.Date date, User user, Time checkin, Time checkout, String content) {
        Optional<DailyLog> dailyLogOptional = dailyLogRepository.findByUserAndDate(user, date);
        if (!dailyLogOptional.isPresent()) {
            DailyLog dailyLog;
            if (checkin != null && checkout == null) {
                dailyLog = getNewDailyLog(date, checkin, checkin, user.getAccount());
            } else if (checkin != null) {
                dailyLog = getNewDailyLog(date, checkin, checkout, user.getAccount());
            } else {
                throw new ServerError("wrong");
            }
            try {
                boolean isViolate = checkoutAnalyzeSchedule.checkViolate(dailyLog, user.getAccount(), date);
                dailyLogRepository.save(dailyLog);
                saveToChangeLog(user.getAccount(), date, checkin, checkout, isViolate, content);
            } catch (Exception e) {
                throw new ServerError("Something went wrong");
            }
        } else {
            DailyLog dailyLog = dailyLogOptional.get();
            if (checkin != null) {
                dailyLog.setCheckin(checkin);
            }
            if (checkout != null) {
                dailyLog.setCheckout(checkout);
            }
            boolean isViolate = dailyLogService.updateDailyLog(user, date, dailyLog.getCheckin(), dailyLog.getCheckout());
            try {
                saveToChangeLog(user.getAccount(), date, checkin, checkout, isViolate, content);
                dailyLogRepository.saveAndFlush(dailyLog);
//                double dayOffLeft = checkoutAnalyzeSchedule.getPermittedLeaveLeft(user.getAccount(), dailyLog.getMonth(), getYear(dailyLog.getDate()), dailyLog);
//                checkoutAnalyzeSchedule.updateDayOffLeft(dailyLog.getMonth(), user.getAccount(), dayOffLeft, getYear(dailyLog.getDate()));
            } catch (Exception e) {
                throw new ServerError("Something went wrong");
            }
        }
    }

    public void saveToChangeLog(Account employee,
                                java.sql.Date date,
                                Time checkin,
                                Time checkout,
                                boolean isViolateChange,
                                String reasons) {
        List<User> managers = userRepository.getManagerByDepartment(employee.getUser().getDepartment().getDepartmentName());
        if (managers.isEmpty()) return;
        User manager = managers.get(0);
        SaveChangeLogRequest saveChangeLogRequest = SaveChangeLogRequest.builder()
                .employeeId(employee.getAccountId())
                .managerId(manager.getUserId())
                .date(date.toString())
                .changeType(ChangeLogType.FROM_REQUEST.toString())
                .violate(isViolateChange)
                .reason(reasons)
                .build();
        if (checkin != null) saveChangeLogRequest.setManualCheckIn(formatter.format(checkin));
        if (checkout != null) saveChangeLogRequest.setManualCheckOut(formatter.format(checkout));

        try {
            requestChangeLogService.saveChangeLog(saveChangeLogRequest);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerError("fail");
        }
    }

    private DailyLog getNewDailyLog(java.sql.Date dailyDate, Time checkinTime, Time checkoutTime, Account account) {
        DailyLog dailyLog = DailyLog.builder()
                .date(dailyDate)
                .checkin(checkinTime)
                .checkout(checkoutTime)
                .totalAttendance(0)
                .morningTotal(0)
                .afternoonTotal(0)
                .earlyCheckout(false)
                .lateCheckin(false)
                .permittedLeave(0)
                .nonPermittedLeave(0)
                .Violate(false)
                .paidDay(0)
                .outsideWork(0)
                .user(account.getUser())
                .build();
        LocalDate localDate = dailyDate.toLocalDate();
        dailyLog.setMonth(localDate.getMonthValue());
        dailyLog.setDateType(dailyLogService.getDateType(dailyDate));
        checkoutAnalyzeSchedule.updateTotalField(dailyLog);
        return dailyLog;
    }
}
