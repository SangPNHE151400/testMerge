package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.ControlLogLcd;
import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.DayOff;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ControlLogStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DateType;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.LateType;
import fpt.capstone.buildingmanagementsystem.model.response.LateFormResponse;
import fpt.capstone.buildingmanagementsystem.repository.AccountRepository;
import fpt.capstone.buildingmanagementsystem.repository.DailyLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.DayOffRepository;
import fpt.capstone.buildingmanagementsystem.repository.LateRequestFormRepositoryV2;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.service.schedule.CheckoutAnalyzeSchedule;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import static fpt.capstone.buildingmanagementsystem.until.Until.roundDouble;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.compareTime;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.getDistanceTime;

@Service
public class DailyLogService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DailyLogRepository dailyLogRepository;

    @Autowired
    LateRequestFormRepositoryV2 lateRequestFormRepositoryV2;

    @Autowired
    CheckoutAnalyzeSchedule checkoutAnalyzeSchedule;

    @Autowired
    DayOffRepository dayOffRepository;

    @Autowired
    HolidayService holidayService;


    private static final Time startMorningTime = Time.valueOf("08:30:00");

    private static final Time endMorningTime = Time.valueOf("12:00:00");

    private static final Time startAfternoonTime = Time.valueOf("13:00:00");

    private static final double One_hour = 1000 * 60 * 60;

    private static final Logger logger = LoggerFactory.getLogger(DailyLogService.class);


    public void mapControlLogToDailyLog(ControlLogLcd controlLogLcd) {
        if (controlLogLcd.getStatus().equals(ControlLogStatus.BLACK_LIST)) return;
        Account account = accountRepository.findByUsername(controlLogLcd.getPersionName())
                .orElseThrow(() -> new BadRequest("Not_found_account"));
        Date dailyDate = new Date(controlLogLcd.getTime().getTime());
        Time dailyTime = new Time(controlLogLcd.getTime().getTime());

        Optional<DailyLog> dailyLogOptional = dailyLogRepository.findByUserAndDate(account.getUser(), dailyDate);

        if (dailyLogOptional.isPresent()) {
            DailyLog dailyLog = updateExistedDailyLog(dailyLogOptional.get(), dailyTime);
            logger.info(dailyLog + "");
            try {
                dailyLogRepository.save(dailyLog);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            addNewDailyLog(dailyDate, dailyTime, account);
        }
    }

    public DailyLog updateExistedDailyLog(DailyLog dailyLog, Time checkoutTime) {

        if (compareTime(checkoutTime, endMorningTime) <= 0) {
            dailyLog.setCheckout(checkoutTime);
            dailyLog.setSystemCheckOut(checkoutTime);

            double morningTotal = roundDouble(getDistanceTime(checkoutTime, dailyLog.getCheckin()) / One_hour);
            dailyLog.setMorningTotal(morningTotal);

            dailyLog.setAfternoonTotal(0);

        } else {
            dailyLog.setCheckout(checkoutTime);
            dailyLog.setSystemCheckOut(checkoutTime);

            double morningTotal = roundDouble(getDistanceTime(endMorningTime, dailyLog.getCheckin()) / One_hour);
            dailyLog.setMorningTotal(morningTotal);
        }

        if (compareTime(dailyLog.getCheckin(), startAfternoonTime) <= 0) {
            dailyLog.setCheckout(checkoutTime);
            dailyLog.setSystemCheckOut(checkoutTime);

            if (compareTime(checkoutTime, startAfternoonTime) >= 0) {
                double afternoonTotal = roundDouble(getDistanceTime(checkoutTime, startAfternoonTime) / One_hour);
                dailyLog.setAfternoonTotal(afternoonTotal);
            }
        } else {
            dailyLog.setCheckout(checkoutTime);
            dailyLog.setSystemCheckOut(checkoutTime);

            double afternoonTotal = roundDouble(getDistanceTime(checkoutTime, dailyLog.getCheckin()) / One_hour);
            dailyLog.setAfternoonTotal(afternoonTotal);
            dailyLog.setMorningTotal(0);
        }

        dailyLog.setTotalAttendance(roundDouble(dailyLog.getMorningTotal() + dailyLog.getAfternoonTotal()));

        if (dailyLog.getDateType().equals(DateType.NORMAL)) {
            dailyLog.setPaidDay(Math.min(roundDouble(dailyLog.getTotalAttendance() / 8), 1));
        }

        return dailyLog;
    }

    private void addNewDailyLog(Date dailyDate, Time checkinTime, Account account) {
        DailyLog dailyLog = DailyLog.builder()
                .date(dailyDate)
                .checkin(checkinTime)
                .checkout(checkinTime)
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
                .systemCheckIn(checkinTime)
                .systemCheckOut(checkinTime)
                .build();
        LocalDate localDate = dailyLog.getDate().toLocalDate();
        dailyLog.setMonth(localDate.getMonthValue());
        dailyLog.setDateType(getDateType(dailyDate));
        getLateCheckInDuration(dailyLog, account.getUser().getUserId(), dailyDate, checkinTime);

        dailyLogRepository.save(dailyLog);
    }

    public void getLateCheckInDuration(DailyLog dailyLog, String userId, Date date, Time checkinTime) {
        if (!dailyLog.getDateType().equals(DateType.NORMAL)) return;
        if (compareTime(checkinTime, startMorningTime) > 0) {
            List<LateFormResponse> findLateMorningAccepted = lateRequestFormRepositoryV2.findLateAndEarlyViolateByUserIdAndDate(userId, date, LateType.LATE_MORNING);
            dailyLog.setLateCheckin(true);
//            if (!findLateMorningAccepted.isEmpty()) {
//                List<LateFormResponse> lateAccepted = findLateMorningAccepted.stream().sorted(Comparator.comparing(LateFormResponse::getLateDuration).reversed())
//                        .collect(Collectors.toList());
//                double lateMinutes = roundDouble((startMorningTime.getTime() - checkinTime.getTime()) / One_minute);
//                dailyLog.setViolate(lateMinutes > lateAccepted.get(0).getLateDuration());
//            } else {
//                dailyLog.setViolate(true);
//            }
            dailyLog.setViolate(findLateMorningAccepted.isEmpty());
        } else {
            dailyLog.setLateCheckin(false);
        }
    }

    public DateType getDateType(Date dailyDate) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(dailyDate);

        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
        boolean isWeekend = (dayOfWeek == Calendar.SATURDAY) || (dayOfWeek == Calendar.SUNDAY);

        if (isWeekend) {
            return DateType.WEEKEND;
        } else if (holidayService.changeDailyLogToHoliday(dailyDate)) {
            return DateType.HOLIDAY;
        } else {
            return DateType.NORMAL;
        }
    }

    public boolean updateDailyLog(User user, Date date, Time checkin, Time checkoutTime) {
        DailyLog dailyLog = dailyLogRepository.findByUserAndDate(user, date)
                .orElseThrow(() -> new BadRequest("Not_found_log"));
        if (checkin != null) dailyLog.setCheckin(checkin);

        if (compareTime(checkoutTime, endMorningTime) < 0) {
            dailyLog.setCheckout(checkoutTime);

            double morningTotal = roundDouble(getDistanceTime(checkoutTime, dailyLog.getCheckin()) / One_hour);
            dailyLog.setMorningTotal(morningTotal);

            dailyLog.setAfternoonTotal(0);

        } else {
            dailyLog.setCheckout(checkoutTime);

            double morningTotal = roundDouble(getDistanceTime(endMorningTime, dailyLog.getCheckin()) / One_hour);
            dailyLog.setMorningTotal(morningTotal);
        }

        if (compareTime(dailyLog.getCheckin(), startAfternoonTime) < 0) {
            dailyLog.setCheckout(checkoutTime);

            if (compareTime(checkoutTime, startAfternoonTime) > 0) {
                double afternoonTotal = roundDouble(getDistanceTime(checkoutTime, startAfternoonTime) / One_hour);
                dailyLog.setAfternoonTotal(afternoonTotal);
            }
        } else {
            dailyLog.setCheckout(checkoutTime);

            double afternoonTotal = roundDouble(getDistanceTime(checkoutTime, dailyLog.getCheckin()) / One_hour);
            dailyLog.setAfternoonTotal(afternoonTotal);
            dailyLog.setMorningTotal(0);
        }

        dailyLog.setTotalAttendance((dailyLog.getMorningTotal() + dailyLog.getAfternoonTotal()));

        if (dailyLog.getDateType().equals(DateType.NORMAL)) {
            dailyLog.setPaidDay(Math.min(roundDouble(dailyLog.getTotalAttendance() / 8), 1));
        }
        return checkoutAnalyzeSchedule.checkViolate(dailyLog, user.getAccount(), date);
    }

    public void checkViolate(DailyLog dailyLog, User user, String reasons) {
        boolean isViolate = checkoutAnalyzeSchedule.checkViolate(dailyLog, user.getAccount(), dailyLog.getDate());
        if (!isViolate) return;
        //change log check
        Date instanceDate = new Date(Until.generateDate().getTime());
        if (instanceDate.compareTo(dailyLog.getDate()) > 0) {
            checkoutAnalyzeSchedule.saveToChangeLog(user.getAccount(), dailyLog.getDate(), -1, isViolate, reasons);
        }
    }

    public List<DayOff> initEmployeeDayOff() {
        List<DayOff> dayOffs = new ArrayList<>();
        accountRepository.findAll()
                .forEach(account -> {
                    DayOff dayOff = DayOff.builder()
                            .account(account)
                            .january(16)
                            .february(16)
                            .april(16)
                            .march(16)
                            .may(16)
                            .july(16)
                            .june(16)
                            .august(16)
                            .september(16)
                            .october(16)
                            .november(16)
                            .december(16)
                            .year(2023)
                            .build();
                    dayOffs.add(dayOff);
                });
        dayOffRepository.saveAll(dayOffs);
        return dayOffs;
    }

    public void initDayOff(String accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BadRequest("not_found_account"));
        DayOff dayOff = DayOff.builder()
                .account(account)
                .january(16)
                .february(16)
                .april(16)
                .march(16)
                .may(16)
                .july(16)
                .june(16)
                .august(16)
                .september(16)
                .october(16)
                .november(16)
                .december(16)
                .year(2023)
                .build();
        try {
            dayOffRepository.save(dayOff);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

