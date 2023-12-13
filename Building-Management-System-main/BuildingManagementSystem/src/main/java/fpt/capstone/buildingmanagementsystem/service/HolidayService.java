package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.EmailCode;
import fpt.capstone.buildingmanagementsystem.model.entity.Holiday;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DateType;
import fpt.capstone.buildingmanagementsystem.model.request.HolidayDeleteRequest;
import fpt.capstone.buildingmanagementsystem.model.request.HolidaySaveRequest;
import fpt.capstone.buildingmanagementsystem.model.response.HolidayResponse;
import fpt.capstone.buildingmanagementsystem.repository.AccountRepository;
import fpt.capstone.buildingmanagementsystem.repository.DailyLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.EmailCodeRepository;
import fpt.capstone.buildingmanagementsystem.repository.HolidayRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.security.PasswordEncode;
import fpt.capstone.buildingmanagementsystem.service.schedule.CheckoutAnalyzeSchedule;
import fpt.capstone.buildingmanagementsystem.until.EmailSender;
import fpt.capstone.buildingmanagementsystem.until.Until;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static fpt.capstone.buildingmanagementsystem.until.Until.getRandomString;


@Service
public class HolidayService {
    @Autowired
    AttendanceService attendanceService;
    @Autowired
    HolidayRepository holidayRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    DailyLogRepository dailyLogRepository;
    @Autowired
    CheckoutAnalyzeSchedule checkoutAnalyzeSchedule;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    PasswordEncode passwordEncode;

    @Autowired
    EmailSender emailSender;

    @Autowired
    EmailCodeRepository emailCodeRepository;

    //check tất cả daily log nếu có rồi thì biến đổi theo fromDate và toDate
    public boolean saveHoliday(HolidaySaveRequest holidaySaveRequest) throws ParseException {
        if (holidaySaveRequest.getUserId() != null && holidaySaveRequest.getTitle() != null && holidaySaveRequest.getContent() != null
                && holidaySaveRequest.getToDate() != null && holidaySaveRequest.getFromDate() != null) {
            if (Validate.validateStartDateAndEndDate(holidaySaveRequest.getFromDate(), holidaySaveRequest.getToDate())) {
                try {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    java.util.Date fromDate = dateFormat.parse(holidaySaveRequest.getFromDate());
                    Date sqlfromDate = new Date(fromDate.getTime());
                    java.util.Date toDate = dateFormat.parse(holidaySaveRequest.getToDate());
                    Date sqltoDate = new Date(toDate.getTime());
                    User user = userRepository.findByUserId(holidaySaveRequest.getUserId()).get();
                    Holiday holiday = Holiday.builder().content(holidaySaveRequest.getContent()).title(holidaySaveRequest.getTitle()).createDate(Until.generateRealTime())
                            .updateDate(Until.generateRealTime()).user(user).toDate(sqltoDate).fromDate(sqlfromDate)
                            .build();
                    holidayRepository.save(holiday);
                    List<DailyLog> dailyLogs = dailyLogRepository.getDailyLogsByFromDateAndToDate(sqlfromDate, sqltoDate);
                    List<DailyLog> convertHoliday = new ArrayList<>();
                    dailyLogs.forEach(dailyLog -> {
                        dailyLog.setDateType(DateType.HOLIDAY);
                        dailyLog.setViolate(false);
                        dailyLog.setLateCheckin(false);
                        dailyLog.setEarlyCheckout(false);
                        dailyLog.setPermittedLeave(0.0);
                        dailyLog.setNonPermittedLeave(0.0);
                        convertHoliday.add(dailyLog);
                    });
                    dailyLogRepository.saveAll(convertHoliday);
                    return true;
                } catch (ServerError e) {
                    throw new ServerError("Fail");
                }
            } else {
                throw new BadRequest("from_date_needs_be_greater_than_to_day");
            }
        } else {
            throw new BadRequest("request_fails");
        }
    }

    public boolean deleteHoliday(HolidayDeleteRequest holidayDeleteRequest) {
        if (holidayDeleteRequest.getHolidayId() != null) {
            try {
                Holiday holiday = holidayRepository.findById(holidayDeleteRequest.getHolidayId()).get();
                holidayRepository.deleteById(holidayDeleteRequest.getHolidayId());
                List<DailyLog> dailyLogs = dailyLogRepository.getDailyLogsByFromDateAndToDate(holiday.getFromDate(), holiday.getToDate());
                List<DailyLog> convertHoliday = new ArrayList<>();
                dailyLogs.forEach(dailyLog -> {
                    if ((attendanceService.getCheckWeekend(dailyLog.getDate()) != Calendar.SATURDAY) && (attendanceService.getCheckWeekend(dailyLog.getDate()) != Calendar.SUNDAY)) {
                        dailyLog.setDateType(DateType.NORMAL);
                    } else {
                        dailyLog.setDateType(DateType.WEEKEND);
                    }
                    checkoutAnalyzeSchedule.checkViolate(dailyLog, dailyLog.getUser().getAccount(), dailyLog.getDate());
                    convertHoliday.add(dailyLog);
                });
                dailyLogRepository.saveAll(convertHoliday);
                return true;
            } catch (Exception e) {
                throw new ServerError("Fail");
            }
        } else {
            throw new BadRequest("request_fails");
        }
    }

    public List<HolidayResponse> listAllHoliday() {
        List<Holiday> holidayList = holidayRepository.findAll();
        List<HolidayResponse> holidayResponseList = new ArrayList<>();
        holidayList.forEach(holiday -> {
            HolidayResponse holidayResponse = HolidayResponse.builder().holidayId(holiday.getHolidayId()).username(holiday.getUser().getAccount().getUsername())
                    .content(holiday.getContent()).title(holiday.getTitle()).fromDate(holiday.getFromDate()).toDate(holiday.getToDate()).build();
            holidayResponseList.add(holidayResponse);
        });
        return holidayResponseList;
    }

    public boolean changeDailyLogToHoliday(Date date) {
        List<Holiday> holidayList = holidayRepository.findAll();
        for (Holiday holiday : holidayList) {
            Timestamp timeStampYesterdayDate = new java.sql.Timestamp(date.getTime());
            Timestamp timeStampFromDate = new java.sql.Timestamp(holiday.getFromDate().getTime());
            Timestamp timeStampToDate = new java.sql.Timestamp(holiday.getToDate().getTime());
            if (timeStampToDate.getTime() - timeStampYesterdayDate.getTime() >= 0 && timeStampYesterdayDate.getTime() - timeStampFromDate.getTime() >= 0) {
                return true;
            }
        }
        return false;
    }

    public boolean sendHolidayEmail(String userName) {
        try {
            String code = getRandomString(6);
            Account account = accountRepository.findByUsername(userName)
                    .orElseThrow(() -> new BadRequest("Not_found_user"));
            String toEmail = account.getUser().getEmail();
            if (toEmail.equals("unknown")) {
                throw new NotFound("Not_found_email");
            }
            EmailCode emailCode = EmailCode.builder()
                    .code(code)
                    .userId(account.getAccountId())
                    .build();
            emailCodeRepository.save(emailCode);
            emailSender.setMailSender(toEmail, "[Notification] - BMS verify code: " + code, "Code:" + code + "\nCode can only be used once!");
            return true;
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    public boolean checkHolidayCode(String code, String userId) {
        List<EmailCode> emailCodes = emailCodeRepository.findByCodeAndUserId(code, userId);
        if (emailCodes.isEmpty()) return false;
        else {
            emailCodeRepository.deleteAll(emailCodes);
            return true;
        }
    }
}
