package fpt.capstone.buildingmanagementsystem.validate;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.repository.MonthlyEvaluateRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.service.MonthlyEvaluateService;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Time;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.regex.Pattern;

@Component
public class Validate {
    @Autowired
    MonthlyEvaluateService monthlyEvaluateService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    MonthlyEvaluateRepository monthlyEvaluateRepository;
    public static final String DATE_FORMAT = "^\\d{4}\\-(0[1-9]|1[0-2])\\-(0[1-9]|1\\d|2\\d|3[01])$";
    public static final String TIME_FORMAT = "^(2[0-3]|1[0-9]||0[0-9])\\:([0-5][0-9]|)\\:([0-5][0-9]|)$";
    public static final String DATE_TIME_FORMAT = "^\\d{4}\\-(0[1-9]|1[0-2])\\-(0[1-9]|1\\d|2\\d|3[01])\\s(2[0-3]|1[0-9]||0[0-9])\\:([0-5][0-9]|)\\:([0-5][0-9]|)$";

    private static final SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");


    public static boolean validateDateFormat(String date) {
        if (Pattern.matches(DATE_FORMAT, date.toString())) {
            return true;
        }
        return false;
    }
    public boolean checkValidateExistsEvaluate(String employeeId,String dateString) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = dateFormat.parse(dateString);
        int year = date.getYear() + 1900; // getYear() returns the year minus 1900
        int month = date.getMonth() + 1;
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new NotFound("Not_found_user"));
        boolean check = monthlyEvaluateRepository.existsByEmployeeAndMonthAndYear(user, month, year);
        return !check;
    }
    public static boolean validateDateTime(String time) {
        if (Pattern.matches(TIME_FORMAT, time.toString())) {
            return true;
        }
        return false;
    }

    public static boolean validateDateAndTime(String datetime) {
        if (Pattern.matches(DATE_TIME_FORMAT, datetime.toString())) {
            return true;
        }
        return false;
    }

    public static boolean validateStartTimeAndEndTime(String startTime, String endTime) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
        Date startTime1 = dateFormat.parse(startTime.toString());
        Date endTime1 = dateFormat.parse(endTime.toString());
        Timestamp timestampStartTime = new java.sql.Timestamp(startTime1.getTime());
        Timestamp timestampEndTime = new java.sql.Timestamp(endTime1.getTime());
        if (timestampEndTime.getTime() - timestampStartTime.getTime() <= 0) {
            return false;
        }
        return true;
    }

    public static boolean validateStartDateAndEndDate(String startDate, String endDate) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate1 = dateFormat.parse(startDate.toString());
        Date endDate1 = dateFormat.parse(endDate.toString());
        Timestamp timestampStartTime = new java.sql.Timestamp(startDate1.getTime());
        Timestamp timestampEndTime = new java.sql.Timestamp(endDate1.getTime());
        if (timestampEndTime.getTime() - timestampStartTime.getTime() < 0) {
            return false;
        }
        return true;
    }
    public static boolean validateStartDateAndEndDate2(String startDate, String endDate) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate1 = dateFormat.parse(startDate.toString());
        Date endDate1 = dateFormat.parse(endDate.toString());
        Timestamp timestampStartTime = new java.sql.Timestamp(startDate1.getTime());
        Timestamp timestampEndTime = new java.sql.Timestamp(endDate1.getTime());
        if (timestampEndTime.getTime() - timestampStartTime.getTime() <= 0) {
            return false;
        }
        return true;
    }

    public static boolean checkDateLeave(String startDate) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date realDate = Until.generateDate();
        Date startDate1 = dateFormat.parse(startDate.toString());
        Timestamp timestampStartTime = new java.sql.Timestamp(startDate1.getTime());
        Timestamp timestampRealDate = new java.sql.Timestamp(realDate.getTime());
        if (timestampStartTime.getTime() - timestampRealDate.getTime() < 0) {
            return false;
        }
        return true;
    }

    public static boolean checkUploadDateRealTime(String startDate) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.MINUTE, 4);
        Date realDate = calendar.getTime();
        Date startDate1 = dateFormat.parse(startDate.toString());
        Timestamp timestampStartTime = new java.sql.Timestamp(startDate1.getTime());
        Timestamp timestampRealDate = new java.sql.Timestamp(realDate.getTime());
        if (timestampStartTime.getTime() - timestampRealDate.getTime() < 0) {
            return false;
        }
        return true;
    }

    public static boolean checkDateBookingRoom(String startDate, String startTime) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
        Date realDate = Until.generateDate();
        Date startDate1 = dateFormat.parse(startDate.toString());
        Date realtime = Until.generateTime();
        Date startTime1 = timeFormat.parse(startTime.toString());
        Timestamp timestampStartDate = new java.sql.Timestamp(startDate1.getTime());
        Timestamp timestampRealDate = new java.sql.Timestamp(realDate.getTime());
        Timestamp timestampStartTime = new java.sql.Timestamp(startTime1.getTime());
        Timestamp timestampRealTime = new java.sql.Timestamp(realtime.getTime());
        if (timestampStartDate.getTime() - timestampRealDate.getTime() < 0) {
            return false;
        }
        if (timestampStartDate.getTime() - timestampRealDate.getTime() == 0) {
            return timestampStartTime.getTime() - timestampRealTime.getTime() >= 0;
        }
        return true;
    }

    public static double getDistanceTime(Time a, Time b) {
        if (a == null || b == null) return 0;
        String stringA = sdf.format(a);
        String stringB = sdf.format(b);

        java.util.Date dateTimeA;
        java.util.Date dateTimeB;
        try {
            dateTimeA = sdf.parse(stringA);
            dateTimeB = sdf.parse(stringB);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        Timestamp timestampA = new Timestamp(dateTimeA.getTime());
        Timestamp timestampB = new Timestamp(dateTimeB.getTime());
        return timestampA.getTime() - timestampB.getTime();
    }

    public static int compareTime(Time a, Time b) {
        if (a == null && b == null) return 0;
        else if (a == null) return -1;
        else if (b == null) return 1;

        String stringA = sdf.format(a);
        String stringB = sdf.format(b);

        java.util.Date dateTimeA;
        java.util.Date dateTimeB;
        try {
            dateTimeA = sdf.parse(stringA);
            dateTimeB = sdf.parse(stringB);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        Timestamp timestampA = new Timestamp(dateTimeA.getTime());
        Timestamp timestampB = new Timestamp(dateTimeB.getTime());
        if (timestampA.getTime() - timestampB.getTime() == 0) return 0;
        else if (timestampA.getTime() - timestampB.getTime() > 0) {
            return 1;
        } else return -1;
    }
}
