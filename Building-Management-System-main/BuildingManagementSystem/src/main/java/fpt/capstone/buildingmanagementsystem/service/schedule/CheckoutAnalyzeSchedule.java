package fpt.capstone.buildingmanagementsystem.service.schedule;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.DayOff;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LeaveRequestForm;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.WorkingOutsideRequestForm;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ChangeLogType;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DateType;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.LateType;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.WorkingOutsideType;
import fpt.capstone.buildingmanagementsystem.model.request.SaveChangeLogRequest;
import fpt.capstone.buildingmanagementsystem.model.response.LateFormResponse;
import fpt.capstone.buildingmanagementsystem.repository.AccountRepository;
import fpt.capstone.buildingmanagementsystem.repository.ControlLogLcdRepository;
import fpt.capstone.buildingmanagementsystem.repository.DailyLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.DayOffRepository;
import fpt.capstone.buildingmanagementsystem.repository.LateRequestFormRepositoryV2;
import fpt.capstone.buildingmanagementsystem.repository.LeaveRequestFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.repository.WorkingOutsideFormRepository;
import fpt.capstone.buildingmanagementsystem.service.DailyLogService;
import fpt.capstone.buildingmanagementsystem.service.RequestChangeLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static fpt.capstone.buildingmanagementsystem.until.Until.getYear;
import static fpt.capstone.buildingmanagementsystem.until.Until.roundDouble;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.compareTime;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.getDistanceTime;

@Component
public class CheckoutAnalyzeSchedule {

    @Autowired
    ControlLogLcdRepository controlLogLcdRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DailyLogRepository dailyLogRepository;

    @Autowired
    DayOffRepository dayOffRepository;

    @Autowired
    LeaveRequestFormRepository leaveRequestFormRepository;

    @Autowired
    LateRequestFormRepositoryV2 lateRequestFormRepository;

    @Autowired
    WorkingOutsideFormRepository workingOutsideFormRepository;

    @Autowired
    RequestChangeLogService requestChangeLogService;

    @Autowired
    DailyLogService dailyLogService;

    private static final Time startMorningTime = Time.valueOf("08:30:00");

    private static final Time endMorningTime = Time.valueOf("12:00:00");

    private static final Time startAfternoonTime = Time.valueOf("13:00:00");

    private static final Time endAfternoonTime = Time.valueOf("17:30:00");

    private static final double One_hour = 1000 * 60 * 60;

    private static final Logger logger = LoggerFactory.getLogger(CheckoutAnalyzeSchedule.class);

    //todo: set cron by api
    //cron = "0 01 0 * * ?"
    @Scheduled(cron = "0 56 1 * * ?")
    @Transactional
    public void scheduledCheckoutAnalyst() {
        List<User> users = userRepository.findAll();

        List<DailyLog> dailyLogs = dailyLogRepository.findByDate(getYesterdayDate());
        Date yesterday = getYesterdayDate();
        dailyLogs.forEach(dailyLog -> getPersonalLastCheckout(dailyLog.getUser().getAccount(), yesterday));

        // Day off
        Map<String, DailyLog> dailyMap = dailyLogs.stream()
                .collect(Collectors.toMap(dailyLog -> dailyLog.getUser().getUserId(), Function.identity()));

        List<User> userOffs = users.stream()
                .filter(user -> !dailyMap.containsKey(user.getUserId()))
                .collect(Collectors.toList());
        List<DailyLog> workOffs = new ArrayList<>();
        userOffs.forEach(userOff -> {
            DailyLog workOff = getOffWorkDaily(userOff.getAccount(), yesterday);
            workOffs.add(workOff);
        });
        dailyLogRepository.saveAll(workOffs);
    }

    private Date getYesterdayDate() {
        Date today = new Date(System.currentTimeMillis());

        Calendar cal = Calendar.getInstance();
        cal.setTime(today);
        cal.add(Calendar.DATE, -1);
        return new java.sql.Date(cal.getTimeInMillis());
    }

    private void getPersonalLastCheckout(Account account, Date yesterday) {
        DailyLog dailyLog = dailyLogRepository.getLastCheckoutOfDateByUserId(account.getAccountId(), yesterday)
                .orElseThrow(() -> new BadRequest("Not_found"));
        dailyLog.setDateType(dailyLogService.getDateType(yesterday));
        double workingOutsideChange = checkWorkingOutside(dailyLog, account, yesterday);
        boolean isViolateChange = checkViolate(dailyLog, account, yesterday);
        if (workingOutsideChange > 0 && isViolateChange) {
            saveToChangeLog(account, yesterday, workingOutsideChange, true, "REQUEST");
        }
        logger.info(dailyLog + "");
        dailyLogRepository.save(dailyLog);
    }

    private DailyLog getOffWorkDaily(Account account, Date yesterday) {
        DailyLog offWork = DailyLog.builder()
                .date(yesterday)
                .checkin(null)
                .checkout(null)
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
                .systemCheckIn(null)
                .systemCheckOut(null)
                .build();
        LocalDate localDate = yesterday.toLocalDate();
        offWork.setMonth(localDate.getMonthValue());
        offWork.setDateType(dailyLogService.getDateType(yesterday));
        double workingOutsideChange = checkWorkingOutside(offWork, account, yesterday);
        if (workingOutsideChange > 0) {
            saveToChangeLog(account, yesterday, workingOutsideChange, false, "REQUEST");
        }
        checkLeaveViolate(account, offWork, yesterday);
        return offWork;
    }

    private void checkLeaveViolate(Account account, DailyLog offWork, Date date) {
        if (!offWork.getDateType().equals(DateType.NORMAL)) return;
        int year = getYear(offWork.getDate());
        List<LeaveRequestForm> leaveRequestForms = leaveRequestFormRepository.findRequestByUserIdAndDate(account.getAccountId(), date);
        double permittedLeft = getPermittedLeaveLeft(account, offWork.getMonth(), year, offWork);
        if (permittedLeft >= 8) {
            offWork.setPermittedLeave(8);
            updateDayOffLeft(offWork.getMonth(), account, permittedLeft - 8, year);
        } else {
            offWork.setPermittedLeave(permittedLeft);
            offWork.setNonPermittedLeave(8 - permittedLeft);
            updateDayOffLeft(offWork.getMonth(), account, 0, year);
        }
        offWork.setViolate(leaveRequestForms.isEmpty());
    }

    public double checkWorkingOutside(DailyLog dailyLog, Account account, Date yesterday) {
        Map<WorkingOutsideType, List<WorkingOutsideRequestForm>> workingOutsideRequests = workingOutsideFormRepository.findByUserIdAndDate(account.getAccountId(), yesterday)
                .stream()
                .collect(Collectors.groupingBy(WorkingOutsideRequestForm::getType, Collectors.toList()));
        if (workingOutsideRequests.isEmpty()) return -1;

        double workingOutsideType = -1;

        Time checkin = null;
        Time checkout = null;
        if (workingOutsideRequests.containsKey(WorkingOutsideType.HALF_MORNING)) {
            checkin = startMorningTime;
            if (compareTime(dailyLog.getCheckout(), endMorningTime) < 0 || dailyLog.getCheckout() == null) {
                checkout = endMorningTime;
            }
            workingOutsideType = 0.5;
        }

        if (workingOutsideRequests.containsKey(WorkingOutsideType.HALF_AFTERNOON)) {
            checkout = endAfternoonTime;
            if (compareTime(dailyLog.getCheckin(), startAfternoonTime) > 0 || dailyLog.getCheckin() == null) {
                checkin = startAfternoonTime;
            }
            workingOutsideType = 0.5;
        }

        if (workingOutsideRequests.containsKey(WorkingOutsideType.ALL_DAY)) {
            checkin = startMorningTime;
            checkout = endAfternoonTime;
            workingOutsideType = 1;
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
        //set total time
        updateTotalField(dailyLog);
        return workingOutsideType;
    }

    public void updateTotalField(DailyLog dailyLog) {
        if (compareTime(dailyLog.getCheckout(), endMorningTime) <= 0) {
            double morningTotal = roundDouble(getDistanceTime(dailyLog.getCheckout(), dailyLog.getCheckin()) / One_hour);
            dailyLog.setMorningTotal(morningTotal);
            dailyLog.setAfternoonTotal(0);

        } else {
            double morningTotal = roundDouble(getDistanceTime(endMorningTime, dailyLog.getCheckin()) / One_hour);
            dailyLog.setMorningTotal(morningTotal);
        }

        if (compareTime(dailyLog.getCheckin(), startAfternoonTime) < 0) {
            if (compareTime(dailyLog.getCheckout(), startAfternoonTime) > 0) {
                double afternoonTotal = roundDouble(getDistanceTime(dailyLog.getCheckout(), startAfternoonTime) / One_hour);
                dailyLog.setAfternoonTotal(afternoonTotal);
            } else {
                dailyLog.setAfternoonTotal(0);

            }
        } else {
            double afternoonTotal = roundDouble(getDistanceTime(dailyLog.getCheckout(), dailyLog.getCheckin()) / One_hour);
            dailyLog.setAfternoonTotal(afternoonTotal);
            dailyLog.setMorningTotal(0);
        }
        dailyLog.setTotalAttendance(roundDouble(dailyLog.getMorningTotal() + dailyLog.getAfternoonTotal()));
        if (dailyLog.getDateType().equals(DateType.NORMAL)) {
            dailyLog.setPaidDay(Math.min(roundDouble(dailyLog.getTotalAttendance() / 8), 1));
        }
    }

    public boolean checkViolate(DailyLog dailyLog, Account account, Date date) {
        boolean isLateCheckinViolate = false;
        boolean isEarlyCheckoutViolate = false;
        boolean isLeaveWithoutNoticeViolate = false;
        if (!dailyLog.getDateType().equals(DateType.NORMAL)) return false;
        int year = getYear(dailyLog.getDate());

        List<LateFormResponse> findLateMorningAccepted = lateRequestFormRepository.findLateAndEarlyViolateByUserIdAndDate(account.getAccountId(), date, LateType.LATE_MORNING);
        if (compareTime(dailyLog.getCheckin(), startMorningTime) > 0) {
            dailyLog.setLateCheckin(true);
            isLateCheckinViolate = findLateMorningAccepted.isEmpty();
        } else {
            dailyLog.setLateCheckin(false);
        }

        List<LateFormResponse> earlyCheckout = lateRequestFormRepository.findLateAndEarlyViolateByUserIdAndDate(account.accountId, date, LateType.EARLY_AFTERNOON)
                .stream().sorted(Comparator.comparing(LateFormResponse::getLateDuration).reversed())
                .collect(Collectors.toList());

        if (compareTime(dailyLog.getCheckout(), endAfternoonTime) < 0) {
            dailyLog.setEarlyCheckout(true);
            isEarlyCheckoutViolate = earlyCheckout.isEmpty();
        } else {
            dailyLog.setEarlyCheckout(false);
        }
        List<LeaveRequestForm> leaveRequestForms = leaveRequestFormRepository.findRequestByUserIdAndDate(account.getAccountId(), date);
        if (getDistanceTime(dailyLog.getCheckout(), dailyLog.getCheckin()) / One_hour < 6) {
            double offHours = roundDouble(8 - dailyLog.getTotalAttendance());
            double permittedLeaveLeft = roundDouble(getPermittedLeaveLeft(account, dailyLog.getMonth(), year, dailyLog));

            isLeaveWithoutNoticeViolate = leaveRequestForms.isEmpty();

            if (offHours <= permittedLeaveLeft) {
                dailyLog.setPermittedLeave(offHours);
                dailyLog.setNonPermittedLeave(0);
                updateDayOffLeft(dailyLog.getMonth(), account, permittedLeaveLeft - offHours, year);
            } else {
                dailyLog.setPermittedLeave(permittedLeaveLeft);
                dailyLog.setNonPermittedLeave(roundDouble(offHours - permittedLeaveLeft));
                updateDayOffLeft(dailyLog.getMonth(), account, 0, year);
            }
        } else {
            dailyLog.setPermittedLeave(0);
            dailyLog.setNonPermittedLeave(0);
        }
        boolean checkViolate = isLateCheckinViolate ||
                isEarlyCheckoutViolate ||
                isLeaveWithoutNoticeViolate;
        if (checkViolate != dailyLog.isViolate()) {
            dailyLog.setViolate(checkViolate);
            return true;
        }
        return false;
    }

    @Transactional
    public void saveToChangeLog(Account employee,
                                Date date,
                                double workingOutside,
                                boolean isViolateChange,
                                String reasons) {
        List<User> managers = userRepository.getManagerByDepartment(employee.getUser().getDepartment().getDepartmentName());
        if (managers.isEmpty()) return;
        User manager = managers.get(0);
        SaveChangeLogRequest saveChangeLogRequest = SaveChangeLogRequest.builder()
                .employeeId(employee.getAccountId())
                .managerId(manager.getUserId())
                .date(date.toString())
                .workOutSide(workingOutside + "")
                .changeType(ChangeLogType.FROM_REQUEST.toString())
                .violate(isViolateChange)
                .reason(reasons)
                .build();
        try {
            requestChangeLogService.saveChangeLog(saveChangeLogRequest);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerError("fail");
        }
    }

    public double getPermittedLeaveLeft(Account account, int month, int year, DailyLog newLog) {
        double permittedHoursLeft = getDayOffOfMonth(month, account, year);
        List<DailyLog> dailyLogs = dailyLogRepository.findAllByUserAndMonth(account.getUser(), month);

        double permittedHours = dailyLogs
                .stream()
                .filter(dailyLog -> dailyLog.getDate() != newLog.getDate())
                .mapToDouble(DailyLog::getPermittedLeave)
                .sum();

        for (DailyLog dailyLog : dailyLogs) {
            if (dailyLog.getDailyId().equals(newLog.getDailyId())) {
                permittedHoursLeft += dailyLog.getPermittedLeave();
            }
        }

        return roundDouble(permittedHoursLeft - permittedHours < 0 ? 0 : permittedHoursLeft - permittedHours);
    }

    public void updateDayOffLeft(int month, Account account, double hourLeft, int year) {
        DayOff dayOff = dayOffRepository.findByAccountAndYear(account, year)
                .orElseThrow(() -> new BadRequest("Not_found"));

        switch (month) {
            case 1:
                dayOff.setJanuary(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 2:
                dayOff.setFebruary(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 3:
                dayOff.setApril(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 4:
                dayOff.setMarch(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 5:
                dayOff.setMay(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 6:
                dayOff.setJune(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 7:
                dayOff.setJuly(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 8:
                dayOff.setAugust(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 9:
                dayOff.setSeptember(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 10:
                dayOff.setOctober(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 11:
                dayOff.setNovember(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            case 12:
                dayOff.setDecember(hourLeft);
                dayOffRepository.save(dayOff);
                return;
            default:
                throw new NotFound("Not_found_month");
        }
    }

    private double getDayOffOfMonth(int month, Account account, int year) {
        DayOff dayOff = dayOffRepository.findByAccountAndYear(account, year)
                .orElseThrow(() -> new BadRequest("Not_found"));

        switch (month) {
            case 1:
                return dayOff.getJanuary();
            case 2:
                return dayOff.getFebruary();
            case 3:
                return dayOff.getApril();
            case 4:
                return dayOff.getMarch();
            case 5:
                return dayOff.getMay();
            case 6:
                return dayOff.getJune();
            case 7:
                return dayOff.getJuly();
            case 8:
                return dayOff.getAugust();
            case 9:
                return dayOff.getSeptember();
            case 10:
                return dayOff.getOctober();
            case 11:
                return dayOff.getNovember();
            case 12:
                return dayOff.getDecember();
            default:
                throw new NotFound("Not_found_month");
        }
    }
}
